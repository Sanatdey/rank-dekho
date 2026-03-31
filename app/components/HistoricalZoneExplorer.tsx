"use client";

import { useState } from "react";

type ZonePair = {
  zone: string;
  in2019: number;
  in2024: number;
  in2025: number;
};

type CutoffMap = Record<
  string,
  {
    in2019: string;
    in2024: string;
    in2025: string;
  }
>;

type HistoricalZoneExplorerProps = {
  zonePairs: ZonePair[];
  cutoffMap: CutoffMap;
  maxZoneValue: number;
};

type YearKey = "in2019" | "in2024" | "in2025";

const YEAR_CONFIG: Array<{
  year: string;
  key: YearKey;
  fill: string;
}> = [
  {
    year: "2019",
    key: "in2019",
    fill: "from-amber-500 to-orange-500",
  },
  {
    year: "2024",
    key: "in2024",
    fill: "from-orange-500 to-red-500",
  },
  {
    year: "2025",
    key: "in2025",
    fill: "from-red-500 to-rose-600",
  },
];

const SIGNAL_CUTOFF_MIN = 58;
const SIGNAL_CUTOFF_MAX = 81;

function widthPercent(value: number, maxZoneValue: number) {
  if (maxZoneValue <= 0) return 0;
  return (value / maxZoneValue) * 100;
}

function parseCutoffBand(label: string) {
  const matchedRange = label.match(/(\d+)\s*-\s*(\d+)/);

  if (matchedRange) {
    return {
      min: Number(matchedRange[1]),
      max: Number(matchedRange[2]),
      derived: false,
    };
  }

  const normalized = label.toLowerCase();

  if (normalized.includes("no placeholder seats")) {
    return null;
  }

  if (
    normalized.includes("top cutoff") ||
    normalized.includes("heaviest pressure") ||
    normalized.includes("among the toughest") ||
    normalized.includes("among the top cutoff")
  ) {
    return { min: 76, max: 80, derived: true };
  }

  if (
    normalized.includes("premium zone") ||
    normalized.includes("premium pressure") ||
    normalized.includes("historic premium")
  ) {
    return { min: 75, max: 79, derived: true };
  }

  if (normalized.includes("high pressure")) {
    return { min: 73, max: 76, derived: true };
  }

  if (
    normalized.includes("upper-mid pressure") ||
    normalized.includes("stronger than before")
  ) {
    return { min: 71, max: 75, derived: true };
  }

  if (
    normalized.includes("moderate seat cluster") ||
    normalized.includes("meaningful seat cluster")
  ) {
    return { min: 70, max: 74, derived: true };
  }

  if (
    normalized.includes("low-volume") ||
    normalized.includes("low volume") ||
    normalized.includes("volatile")
  ) {
    return { min: 68, max: 72, derived: true };
  }

  return { min: 72, max: 76, derived: true };
}

function percentileFromHigherIsBetter(value: number, values: number[]) {
  const uniqueSorted = [...values].sort((a, b) => a - b);
  const rank = uniqueSorted.findIndex((item) => item === value);
  if (rank === -1 || uniqueSorted.length === 1) return 50;
  return Math.round((rank / (uniqueSorted.length - 1)) * 100);
}

function percentileFromLowerIsBetter(value: number, values: number[]) {
  const uniqueSorted = [...values].sort((a, b) => a - b);
  const rank = uniqueSorted.findIndex((item) => item === value);
  if (rank === -1 || uniqueSorted.length === 1) return 50;
  return Math.round(((uniqueSorted.length - 1 - rank) / (uniqueSorted.length - 1)) * 100);
}

function compactVerdict(score: number) {
  if (score >= 70) return "Good";
  if (score >= 45) return "Careful";
  return "Risky";
}

function pressurePercentFromCutoff(label: string) {
  const band = parseCutoffBand(label);

  if (!band) return 0;

  const midpoint = (band.min + band.max) / 2;
  return Math.max(
    8,
    ((midpoint - SIGNAL_CUTOFF_MIN) / (SIGNAL_CUTOFF_MAX - SIGNAL_CUTOFF_MIN)) * 100
  );
}

function scoreStyles(score: number) {
  if (score >= 70) {
    return {
      card: "border-green-300/40 bg-green-400/12",
      chip: "bg-green-500 text-white",
      text: "text-green-100",
      ring: "from-green-500 to-emerald-600",
      bar: "from-green-500 to-emerald-600",
    };
  }

  if (score >= 45) {
    return {
      card: "border-yellow-300/40 bg-yellow-400/12",
      chip: "bg-yellow-400 text-gray-950",
      text: "text-yellow-100",
      ring: "from-yellow-400 to-amber-500",
      bar: "from-yellow-400 to-amber-500",
    };
  }

  return {
    card: "border-rose-300/40 bg-rose-400/12",
    chip: "bg-rose-600 text-white",
    text: "text-rose-100",
    ring: "from-rose-500 to-red-600",
    bar: "from-rose-500 to-red-600",
  };
}

function verdictReason(vacancy: number, score: number) {
  if (vacancy === 0) {
    return "No seats are visible in the current 2025 split.";
  }

  if (score >= 70) {
    return "Seat support still looks meaningful for this zone.";
  }

  if (score >= 45) {
    return "The zone is workable, but compare it with a safer option too.";
  }

  return "Seats look too thin or pressure looks too sharp here.";
}

export default function HistoricalZoneExplorer({
  zonePairs,
  cutoffMap,
  maxZoneValue,
}: HistoricalZoneExplorerProps) {
  const [selectedZone, setSelectedZone] = useState(zonePairs[0]?.zone ?? "");

  const zone = zonePairs.find((item) => item.zone === selectedZone) ?? zonePairs[0];
  const cutoff = cutoffMap[zone.zone];

  if (!zone || !cutoff) {
    return null;
  }

  const yearlyDecisionData = YEAR_CONFIG.map((config) => {
    const allVacancies = zonePairs.map((item) => item[config.key]);
    const allCutoffs = zonePairs
      .map((item) => parseCutoffBand(cutoffMap[item.zone][config.key]))
      .filter((item): item is NonNullable<typeof item> => Boolean(item))
      .map((item) => (item.min + item.max) / 2);

    const zoneBand = parseCutoffBand(cutoff[config.key]);
    const zoneMidpoint = zoneBand ? (zoneBand.min + zoneBand.max) / 2 : SIGNAL_CUTOFF_MAX;
    const vacancyPercentile = percentileFromHigherIsBetter(zone[config.key], allVacancies);
    const cutoffEasePercentile = percentileFromLowerIsBetter(zoneMidpoint, allCutoffs);
    const opportunityPercentile = Math.round(
      vacancyPercentile * 0.55 + cutoffEasePercentile * 0.45
    );

    return {
      ...config,
      vacancy: zone[config.key],
      cutoff: cutoff[config.key],
      vacancyPercentile,
      cutoffEasePercentile,
      opportunityPercentile,
    };
  });

  const currentYearDecision =
    yearlyDecisionData.find((item) => item.year === "2025") ??
    yearlyDecisionData[yearlyDecisionData.length - 1];
  const currentStyle = scoreStyles(currentYearDecision.opportunityPercentile);

  return (
    <div className="mt-6 w-full min-w-0 overflow-x-hidden rounded-[28px] border border-gray-100 bg-gradient-to-b from-gray-50 to-white p-4 sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-600">
            Zone explorer
          </p>
          <h3 className="mt-2 text-2xl font-bold text-gray-900">
            Compare one board at a time
          </h3>
          <p className="mt-2 max-w-2xl text-sm text-gray-600">
            Pick a zone to see how vacancy support and cutoff pressure moved from 2019 to 2025.
          </p>
        </div>

        <div className="w-full lg:w-72">
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
            Select zone
          </label>
          <select
            value={selectedZone}
            onChange={(event) => setSelectedZone(event.target.value)}
            className="w-full rounded-2xl border border-orange-200 bg-white px-4 py-3 text-sm font-semibold text-gray-800 shadow-sm outline-none ring-0"
          >
            {zonePairs.map((item) => (
              <option key={item.zone} value={item.zone}>
                {item.zone}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-[28px] border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-gray-950 shadow-[0_30px_80px_rgba(15,23,42,0.28)]">
        <div className="border-b border-white/10 px-4 py-5 sm:px-5">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-200">
                  Vacancy vs cutoff chart
                </p>
                <h4 className="mt-2 text-2xl font-bold text-white">{zone.zone}</h4>
                <p className="mt-2 max-w-2xl text-sm text-slate-300">
                  Each row compares seat strength and cutoff pressure for one year, so the zone is easier to judge at a glance.
                </p>
              </div>

              <div className={`self-start rounded-2xl border px-4 py-3 shadow-lg ${currentStyle.card}`}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-300">
                  2025 zone call
                </p>
                <div className="mt-2 flex items-center gap-3">
                  <span className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] ${currentStyle.chip}`}>
                    {compactVerdict(currentYearDecision.opportunityPercentile)}
                  </span>
                  <span className="text-lg font-bold text-white">
                    {currentYearDecision.opportunityPercentile}/100
                  </span>
                </div>
                <p className={`mt-2 text-sm ${currentStyle.text}`}>
                  {verdictReason(
                    currentYearDecision.vacancy,
                    currentYearDecision.opportunityPercentile
                  )}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <div className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[11px] font-semibold text-orange-100">
                Top bar = seats
              </div>
              <div className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[11px] font-semibold text-orange-100">
                Bottom bar = cutoff
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-3 px-4 py-4 sm:px-5 sm:py-5">
          {yearlyDecisionData.map((item) => {
            const itemStyle = scoreStyles(item.opportunityPercentile);

            return (
              <div
                key={`chart-row-${item.year}`}
                className="rounded-[22px] border border-white/10 bg-white/6 p-3 shadow-[0_14px_30px_rgba(0,0,0,0.18)] backdrop-blur-sm"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-orange-200">
                      {item.year}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] ${itemStyle.chip}`}>
                      {compactVerdict(item.opportunityPercentile)}
                    </span>
                  </div>
                </div>

                <div className="mt-3 space-y-2">
                  <div>
                    <div className="mb-1 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                      <span>Seats</span>
                      <span>{item.vacancyPercentile}</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/10">
                      <div
                        className={`h-2 rounded-full bg-gradient-to-r ${itemStyle.bar}`}
                        style={{ width: `${widthPercent(item.vacancy, maxZoneValue)}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="mb-1 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                      <span>Cutoff</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/10">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-fuchsia-500 via-rose-500 to-orange-400"
                        style={{ width: `${pressurePercentFromCutoff(item.cutoff)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
