import { db } from "../../lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  getCountFromServer,
} from "firebase/firestore";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get("name");

    if (!name) {
      return Response.json({ error: "Name required" }, { status: 400 });
    }

    const scoresRef = collection(db, "scores");

    const userSnap = await getDocs(
      query(scoresRef, where("name", "==", name))
    );

    if (userSnap.empty) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const user = userSnap.docs[0].data();

    const higher = await getCountFromServer(
      query(scoresRef, where("marks", ">", user.marks))
    );

    const rank = higher.data().count + 1;

    return Response.json({
      name,
      marks: user.marks,
      rank,
    });

  } catch (err) {
    console.error("Rank API error:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}