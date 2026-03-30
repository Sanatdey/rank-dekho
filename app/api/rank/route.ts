import { getPublicSnapshot } from "../../lib/public-cache";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get("name")?.trim().toLowerCase();

    if (!name) {
      return Response.json({ error: "Name required" }, { status: 400 });
    }

    const snapshot = await getPublicSnapshot();
    const user = snapshot.scores.find((score) => score.lowerName === name);

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    return Response.json({
      name: user.name,
      marks: user.marks,
      rank: user.overallRank,
    });
  } catch (err) {
    console.error("Rank API error:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
