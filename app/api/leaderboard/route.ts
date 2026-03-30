import { getPublicSnapshot, type PublicScore } from "../../lib/public-cache";

const PAGE_SIZE = 30;

function stripSearchIndex(score: PublicScore) {
  const { lowerName, ...publicScore } = score;
  void lowerName;
  return publicScore;
}

function sortLeaderboardEntries(
  scores: PublicScore[],
  useZoneCategoryRank: boolean
) {
  return [...scores].sort((a, b) => {
    if (useZoneCategoryRank) {
      return a.zoneCategoryRank - b.zoneCategoryRank;
    }

    return a.normalizedRank - b.normalizedRank;
  });
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const zone = searchParams.get("zone");
    const category = searchParams.get("category");
    const lastId = searchParams.get("lastId");

    const snapshot = await getPublicSnapshot();

    const filteredScores = snapshot.scores.filter((score) => {
      if (zone && score.zone !== zone) return false;
      if (category && score.category !== category) return false;
      return true;
    });

    const sortedScores = sortLeaderboardEntries(
      filteredScores,
      Boolean(zone && category)
    );

    const startIndex = lastId
      ? Math.max(
          0,
          sortedScores.findIndex((score) => score.id === lastId) + 1
        )
      : 0;

    const page = sortedScores.slice(startIndex, startIndex + PAGE_SIZE);
    const data = page.map(stripSearchIndex);
    const lastVisible = page[page.length - 1];

    return Response.json({
      data,
      lastId: lastVisible ? lastVisible.id : null,
    });
  } catch (err) {
    console.error("Leaderboard API error:", err);
    return Response.json({ data: [], lastId: null });
  }
}
