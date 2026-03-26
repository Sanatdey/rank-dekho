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

    let q;

    // ✅ If no filters → ALL candidates
    if (!zone && !category) {
      q = query(
        collection(db, "scores"),
        orderBy("marks", "desc"),
        limit(50)
      );
    }else if (zone && !category) {
      q = query(
        collection(db, "scores"),
        where("zone", "==", zone),  
        orderBy("marks", "desc"),
        limit(50)
      );
    }else if (!zone && category) {
      q = query(
        collection(db, "scores"),
        where("category", "==", category),
        orderBy("marks", "desc"),
        limit(50)
      );
    } 
    // ✅ If both filters
    else if (zone && category) {
      q = query(
        collection(db, "scores"),
        where("zone", "==", zone),
        where("category", "==", category),
        orderBy("marks", "desc"),
        limit(50)
      );
    }

    // ✅ Only zone
    else if (zone) {
      q = query(
        collection(db, "scores"),
        where("zone", "==", zone),
        orderBy("marks", "desc"),
        limit(50)
      );
    }

    // ✅ Only category
    else {
      q = query(
        collection(db, "scores"),
        where("category", "==", category),
        orderBy("marks", "desc"),
        limit(50)
      );
    }

    const snapshot = await getDocs(q);

    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return Response.json(data);

  } catch (err) {
    console.error(err);
    return Response.json([], { status: 200 }); // safe fallback
  }
}