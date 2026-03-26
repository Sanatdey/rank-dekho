import { db } from "../../lib/firebase";
import {
  collection,
  getCountFromServer,
  query,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";

export async function GET() {
  try {
    const scoresRef = collection(db, "scores");

    const totalSnap = await getCountFromServer(scoresRef);
    const totalUsers = totalSnap.data().count;

    const highestSnap = await getDocs(
      query(scoresRef, orderBy("marks", "desc"), limit(1))
    );

    const highestMarks = highestSnap.docs[0]?.data()?.marks ?? 0;

    return Response.json({
      totalUsers,
      highestMarks,
    });

  } catch (err) {
    console.error("Stats API error:", err);
    return Response.json({ totalUsers: 0, highestMarks: 0 });
  }
}