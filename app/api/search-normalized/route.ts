import { getPublicSnapshot } from "../../lib/public-cache";

function stripSearchIndex<T extends { lowerName: string }>(score: T) {
  const { lowerName, ...publicScore } = score;
  void lowerName;
  return publicScore;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get("name")?.trim().toLowerCase();

    if (!name) {
      return Response.json([]);
    }

    const snapshot = await getPublicSnapshot();

    const results = snapshot.scores
      .filter((score) => score.lowerName.includes(name))
      .slice(0, 5)
      .map(stripSearchIndex);

    return Response.json(results);
  } catch (err) {
    console.error("Search normalized API error:", err);
    return Response.json([]);
  }
}
