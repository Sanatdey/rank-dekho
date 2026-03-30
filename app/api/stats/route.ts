import { getPublicSnapshot } from "../../lib/public-cache";

export async function GET() {
  try {
    const snapshot = await getPublicSnapshot();
    return Response.json(snapshot.stats);
  } catch (err) {
    console.error("Stats API error:", err);
    return Response.json({ totalUsers: 0, highestMarks: 0 });
  }
}
