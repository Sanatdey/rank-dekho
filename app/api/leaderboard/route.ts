import { db } from "../../lib/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  startAfter,
  doc,
  getDoc,
} from "firebase/firestore";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const zone = searchParams.get("zone");
    const category = searchParams.get("category");
    const lastId = searchParams.get("lastId");

    const constraints: any[] = [];

    if (zone) constraints.push(where("zone", "==", zone));
    if (category) constraints.push(where("category", "==", category));

    constraints.push(orderBy("marks", "desc"));

    if (lastId) {
      const lastDocRef = doc(db, "scores", lastId);
      const lastSnap = await getDoc(lastDocRef);

      if (lastSnap.exists()) {
        constraints.push(startAfter(lastSnap));
      }
    }

    constraints.push(limit(30));

    const q = query(collection(db, "scores"), ...constraints);
    const snapshot = await getDocs(q);

    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const lastVisible = snapshot.docs[snapshot.docs.length - 1];

    return Response.json({
      data,
      lastId: lastVisible ? lastVisible.id : null,
    });

  } catch (err) {
    console.error("Leaderboard API error:", err);
    return Response.json({ data: [], lastId: null });
  }
}