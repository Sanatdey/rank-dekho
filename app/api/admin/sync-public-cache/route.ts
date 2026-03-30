import { syncPublicSnapshotFromFirestore } from "../../../lib/public-cache";

export async function POST() {
  try {
    const snapshot = await syncPublicSnapshotFromFirestore();

    return Response.json({
      success: true,
      updatedAt: snapshot.updatedAt,
      totalUsers: snapshot.stats.totalUsers,
    });
  } catch (err) {
    console.error("Sync public cache API error:", err);
    return Response.json({ error: "Failed" }, { status: 500 });
  }
}
