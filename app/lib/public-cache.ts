import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import { computeIsSafe } from "./rank-logic";

const REDIS_URL = process.env.UPSTASH_REDIS_REST_KV_REST_API_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_KV_REST_API_TOKEN;
const PUBLIC_SNAPSHOT_KEY = "rank-dekho:public-snapshot:v1";
const VACANCY_DOC_ID = "rrb_cen_03_2025";
const MEMORY_TTL_MS = 30 * 1000;
const REDIS_TTL_SECONDS = 24 * 60 * 60;

export type PublicScore = {
  id: string;
  name: string;
  marks: number;
  zone: string;
  category: string;
  shift: string;
  exam?: string;
  normalized: number;
  overallRank: number;
  normalizedRank: number;
  zoneCategoryRank: number;
  shiftZoneCategoryRank: number;
  percentile: number;
  betterThan: number;
  isSafe: boolean;
  createdAt?: string | null;
  lowerName: string;
};

export type PublicSnapshot = {
  updatedAt: string;
  stats: {
    totalUsers: number;
    highestMarks: number;
  };
  scores: PublicScore[];
};

let memorySnapshot: PublicSnapshot | null = null;
let memorySnapshotAt = 0;

type NormalizationStats = {
  global?: { mean: number; sd: number };
  shifts?: Record<string, { mean: number; sd: number }>;
};

type FirestoreScoreData = {
  name?: string;
  marks?: number;
  zone?: string;
  category?: string;
  shift?: string;
  exam?: string;
  createdAt?: {
    toDate?: () => Date;
  };
};

function compareByMarksDesc(a: { marks: number }, b: { marks: number }) {
  return b.marks - a.marks;
}

function compareByNormalizedDesc(
  a: { normalized: number; marks: number },
  b: { normalized: number; marks: number }
) {
  if (b.normalized !== a.normalized) {
    return b.normalized - a.normalized;
  }

  return b.marks - a.marks;
}

function normalizeMarks(
  marks: number,
  shift: string,
  stats?: NormalizationStats
) {
  const shiftStats = stats?.shifts?.[shift];
  const global = stats?.global;

  if (!shiftStats || !global || shiftStats.sd === 0 || global.sd === 0) {
    return marks;
  }

  return ((marks - shiftStats.mean) / shiftStats.sd) * global.sd + global.mean;
}

function getRedisHeaders() {
  return {
    Authorization: `Bearer ${REDIS_TOKEN}`,
    "Content-Type": "application/json",
  };
}

async function runRedisCommand<T>(command: Array<string | number>) {
  if (!REDIS_URL || !REDIS_TOKEN) {
    return null;
  }

  try {
    const res = await fetch(REDIS_URL, {
      method: "POST",
      headers: getRedisHeaders(),
      body: JSON.stringify(command),
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Redis command failed:", res.status, res.statusText);
      return null;
    }

    const json = await res.json();

    if (json?.error) {
      console.error("Redis error:", json.error);
      return null;
    }

    return (json?.result ?? null) as T | null;
  } catch (err) {
    console.error("Redis request failed:", err);
    return null;
  }
}

async function readSnapshotFromRedis() {
  const raw = await runRedisCommand<string>(["GET", PUBLIC_SNAPSHOT_KEY]);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as PublicSnapshot;
  } catch (err) {
    console.error("Failed to parse cached snapshot:", err);
    return null;
  }
}

async function writeSnapshotToRedis(snapshot: PublicSnapshot) {
  const payload = JSON.stringify(snapshot);

  await runRedisCommand([
    "SET",
    PUBLIC_SNAPSHOT_KEY,
    payload,
    "EX",
    REDIS_TTL_SECONDS,
  ]);
}

function setMemorySnapshot(snapshot: PublicSnapshot) {
  memorySnapshot = snapshot;
  memorySnapshotAt = Date.now();
}

export function clearPublicSnapshotMemory() {
  memorySnapshot = null;
  memorySnapshotAt = 0;
}

export async function buildPublicSnapshotFromFirestore(): Promise<PublicSnapshot> {
  const [scoresSnap, statsSnap, vacancySnap] = await Promise.all([
    getDocs(collection(db, "scores")),
    getDoc(doc(db, "normalization", "latest")),
    getDoc(doc(db, "vacancies", VACANCY_DOC_ID)),
  ]);

  const normalizationStats = statsSnap.exists()
    ? (statsSnap.data() as NormalizationStats)
    : undefined;
  const vacancyData = vacancySnap.exists() ? vacancySnap.data() : undefined;

  const baseScores: PublicScore[] = scoresSnap.docs.map((scoreDoc) => {
    const data = scoreDoc.data() as FirestoreScoreData;

    const marks = Number(data.marks ?? 0);
    const shift = String(data.shift ?? "");
    const normalized = normalizeMarks(marks, shift, normalizationStats);

    return {
      id: scoreDoc.id,
      name: String(data.name ?? ""),
      marks,
      zone: String(data.zone ?? ""),
      category: String(data.category ?? ""),
      shift,
      exam: data.exam ? String(data.exam) : undefined,
      normalized: Number(normalized.toFixed(2)),
      createdAt:
        typeof data.createdAt?.toDate === "function"
          ? data.createdAt.toDate().toISOString()
          : null,
      lowerName: String(data.name ?? "").toLowerCase(),
      overallRank: 0,
      normalizedRank: 0,
      zoneCategoryRank: 0,
      shiftZoneCategoryRank: 0,
      percentile: 0,
      betterThan: 0,
      isSafe: false,
    };
  });

  const totalUsers = baseScores.length;
  const highestMarks = totalUsers
    ? Math.max(...baseScores.map((score) => score.marks))
    : 0;

  [...baseScores]
    .sort(compareByMarksDesc)
    .forEach((score, index) => {
      score.overallRank = index + 1;
      score.percentile = Math.max(
        1,
        Math.round((1 - score.overallRank / Math.max(totalUsers, 1)) * 100)
      );
      score.betterThan = totalUsers - score.overallRank + 1;
    });

  [...baseScores]
    .sort(compareByNormalizedDesc)
    .forEach((score, index) => {
      score.normalizedRank = index + 1;
    });

  const zoneCategoryGroups = new Map<string, PublicScore[]>();
  const shiftZoneCategoryGroups = new Map<string, PublicScore[]>();

  baseScores.forEach((score) => {
    const zoneCategoryKey = `${score.zone}__${score.category}`;
    const shiftZoneCategoryKey = `${score.zone}__${score.category}__${score.shift}`;

    const zoneCategoryList = zoneCategoryGroups.get(zoneCategoryKey) ?? [];
    zoneCategoryList.push(score);
    zoneCategoryGroups.set(zoneCategoryKey, zoneCategoryList);

    const shiftZoneCategoryList =
      shiftZoneCategoryGroups.get(shiftZoneCategoryKey) ?? [];
    shiftZoneCategoryList.push(score);
    shiftZoneCategoryGroups.set(shiftZoneCategoryKey, shiftZoneCategoryList);
  });

  zoneCategoryGroups.forEach((group) => {
    group.sort(compareByNormalizedDesc).forEach((score, index) => {
      score.zoneCategoryRank = index + 1;
    });
  });

  shiftZoneCategoryGroups.forEach((group) => {
    group.sort(compareByMarksDesc).forEach((score, index) => {
      score.shiftZoneCategoryRank = index + 1;
    });
  });

  baseScores.forEach((score) => {
    score.isSafe = computeIsSafe({
      zone: score.zone,
      category: score.category,
      zoneCategoryRank: score.zoneCategoryRank,
      vacancyData,
    });
  });

  const scores = [...baseScores].sort((a, b) => {
    if (a.normalizedRank && b.normalizedRank) {
      return a.normalizedRank - b.normalizedRank;
    }

    return compareByNormalizedDesc(a, b);
  });

  return {
    updatedAt: new Date().toISOString(),
    stats: {
      totalUsers,
      highestMarks,
    },
    scores,
  };
}

export async function syncPublicSnapshotFromFirestore() {
  const snapshot = await buildPublicSnapshotFromFirestore();
  setMemorySnapshot(snapshot);
  await writeSnapshotToRedis(snapshot);
  return snapshot;
}

export async function getPublicSnapshot(options?: { forceRefresh?: boolean }) {
  if (!options?.forceRefresh && memorySnapshot) {
    const isFresh = Date.now() - memorySnapshotAt < MEMORY_TTL_MS;
    if (isFresh) {
      return memorySnapshot;
    }
  }

  if (!options?.forceRefresh) {
    const redisSnapshot = await readSnapshotFromRedis();
    if (redisSnapshot) {
      setMemorySnapshot(redisSnapshot);
      return redisSnapshot;
    }
  }

  return syncPublicSnapshotFromFirestore();
}
