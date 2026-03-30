import { addDoc, collection } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { syncPublicSnapshotFromFirestore } from "../../lib/public-cache";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, marks, zone, category, shift, exam } = body;

    if (!name || marks == null) {
      return Response.json({ error: "Missing fields" }, { status: 400 });
    }

    const marksNum = Number(marks);

    const newDoc = await addDoc(collection(db, "scores"), {
      name,
      marks: marksNum,
      zone,
      category,
      shift,
      exam,
      createdAt: new Date(),
    });

    const snapshot = await syncPublicSnapshotFromFirestore();
    const user = snapshot.scores.find((score) => score.id === newDoc.id);

    if (!user) {
      return Response.json(
        { error: "Unable to generate rank for the new submission" },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      rank: {
        overall: user.overallRank,
        normalized: user.normalizedRank,
        zoneCategory: user.zoneCategoryRank,
        shiftZoneCategory: user.shiftZoneCategoryRank,
        percentile: user.percentile,
        totalUsers: snapshot.stats.totalUsers,
        normalizedMarks: Number(user.normalized.toFixed(2)),
        betterThan: user.betterThan,
        highestMarks: snapshot.stats.highestMarks,
      },
    });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
