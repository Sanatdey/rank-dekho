import { db } from "../../lib/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const zone = searchParams.get("zone");
    const category = searchParams.get("category");

    const constraints: any[] = [];

    // ✅ Filters (clean & scalable)
    if (zone) constraints.push(where("zone", "==", zone));
    if (category) constraints.push(where("category", "==", category));

    // ✅ Always sort
    constraints.push(orderBy("marks", "desc"));

    // ✅ Limit (safe for now)
    constraints.push(limit(500));

    const q = query(collection(db, "scores"), ...constraints);

    const snapshot = await getDocs(q);

    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return Response.json(data);

  } catch (err) {
    console.error("Leaderboard API error:", err);
    return Response.json([], { status: 200 });
  }
}