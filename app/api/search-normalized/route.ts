import { db } from "../../lib/firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name")?.toLowerCase();

  if (!name) return Response.json([]);

  // ✅ 1. Fetch ALL scores
  const snapshot = await getDocs(collection(db, "scores"));
  const all = snapshot.docs.map(d => ({
    id: d.id,
    ...(d.data() as any)
  }));

  // ✅ 2. REUSE normalization stats (NO recalculation)
  const statsSnap = await getDoc(doc(db, "normalization", "latest"));

  if (!statsSnap.exists()) {
    return Response.json({ error: "Stats not ready" }, { status: 400 });
  }

  const stats = statsSnap.data();

  // ✅ 3. Normalize function
  const normalize = (marks: number, shift: string) => {
    const shiftStats = stats.shifts?.[shift];
    const global = stats.global;

    if (!shiftStats || shiftStats.sd === 0) return marks;

    return (
      ((marks - shiftStats.mean) / shiftStats.sd) *
        global.sd +
      global.mean
    );
  };

  // ✅ 4. Compute normalized + rank
  const ranked = all
    .map(item => ({
      ...item,
      normalized: normalize(item.marks, item.shift)
    }))
    .sort((a, b) => b.normalized - a.normalized)
    .map((item, index) => ({
      ...item,
      normalizedRank: index + 1
    }));

  // ✅ 5. Search
  const results = ranked.filter(item =>
    item.name.toLowerCase().includes(name)
  );

  return Response.json(results.slice(0, 5));
}