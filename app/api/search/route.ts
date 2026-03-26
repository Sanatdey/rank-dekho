import { db } from "../../lib/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  getCountFromServer,
} from "firebase/firestore";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get("name");

    if (!name) return Response.json([]);

    const scoresRef = collection(db, "scores");

    const q = query(
      scoresRef,
      orderBy("name"),
      where("name", ">=", name),
      where("name", "<=", name + "\uf8ff"),
      limit(10)
    );

    const snapshot = await getDocs(q);

    const results = [];

    for (const docSnap of snapshot.docs) {
      const data = docSnap.data();

      // ✅ GLOBAL RANK
      const higher = await getCountFromServer(
        query(scoresRef, where("marks", ">", data.marks))
      );

      const rank = higher.data().count + 1;

      results.push({
        id: docSnap.id,
        ...data,
        rank,
      });
    }

    return Response.json(results);

  } catch (err) {
    console.error("Search API error:", err);
    return Response.json([]);
  }
}