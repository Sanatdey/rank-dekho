import { db } from "../../lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, marks, zone, category, shift, exam } = body;

    if (!name || marks == null) {
      return Response.json({ error: "Missing fields" }, { status: 400 });
    }

    const marksNum = Number(marks);

    // ✅ Save
    const newDoc = await addDoc(collection(db, "scores"), {
      name,
      marks: marksNum,
      zone,
      category,
      shift,
      exam,
      createdAt: new Date(),
    });

    // ✅ Fetch all scores (needed for ranking)
    const snapshot = await getDocs(collection(db, "scores"));
    const all = snapshot.docs.map((d) => ({
      id: d.id,
      ...(d.data() as any),
    }));

    // ✅ Fetch normalization stats (reuse, no recalculation)
    const statsSnap = await getDoc(doc(db, "normalization", "latest"));
    const stats = statsSnap.data();

    const normalize = (marks: number, shift: string) => {
      const shiftStats = stats?.shifts?.[shift];
      const global = stats?.global;

      if (!shiftStats || shiftStats.sd === 0) return marks;

      return (
        ((marks - shiftStats.mean) / shiftStats.sd) *
          global.sd +
        global.mean
      );
    };

    // ✅ RAW RANK
    const sortedRaw = [...all].sort((a, b) => b.marks - a.marks);
    const overallRank =
      sortedRaw.findIndex((u) => u.id === newDoc.id) + 1;

    // ✅ NORMALIZED RANK
    const sortedNorm = [...all]
      .map((u) => ({
        ...u,
        normalized: normalize(u.marks, u.shift),
      }))
      .sort((a, b) => b.normalized - a.normalized);

    const normalizedRank =
      sortedNorm.findIndex((u) => u.id === newDoc.id) + 1;

    // ✅ Zone + Category
    const zoneCategoryRank =
      all.filter(
        (u) => u.zone === zone && u.category === category
      ).sort((a, b) => b.marks - a.marks)
        .findIndex((u) => u.id === newDoc.id) + 1;

    // ✅ Shift + Zone + Category
    const shiftZoneCategoryRank =
      all.filter(
        (u) =>
          u.zone === zone &&
          u.category === category &&
          u.shift === shift
      ).sort((a, b) => b.marks - a.marks)
        .findIndex((u) => u.id === newDoc.id) + 1;

    return Response.json({
      success: true,
      rank: {
        overall: overallRank,
        normalized: normalizedRank,
        zoneCategory: zoneCategoryRank,
        shiftZoneCategory: shiftZoneCategoryRank,
      },
    });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}