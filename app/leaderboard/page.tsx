"use client";
import { useEffect, useState } from "react";

interface LeaderboardEntry {
  id: string;
  name: string;
  marks: number;
  normalizedMarks?: number;
  shift?: string;
}

export default function Leaderboard() {
  const [zone, setZone] = useState("");
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCTA, setShowCTA] = useState(false);
  const [displayCount, setDisplayCount] = useState(20);

  const zones = [
    "Ahmedabad","Ajmer","Allahabad (Prayagraj)","Bangalore","Bhopal",
    "Bhubaneswar","Bilaspur","Chandigarh","Chennai","Gorakhpur",
    "Guwahati","Jammu","Kolkata","Malda","Mumbai","Muzaffarpur",
    "Patna","Ranchi","Secunderabad","Siliguri","Thiruvananthapuram"
  ];

  const fetchData = () => {
    setLoading(true);
    setShowCTA(false);

    const params = new URLSearchParams();
    if (zone) params.append("zone", zone);
    if (category) params.append("category", category);

    fetch(`/api/leaderboard?${params.toString()}`)
      .then((res) => res.json())
      .then((res) => {
        setData(res);
        setLoading(false);
        setTimeout(() => setShowCTA(true), 1200);
      })
      .catch(() => {
        setData([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
    setDisplayCount(20);
  }, [zone, category]);

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + 10);
  };

  const handleRefresh = () => {
    fetchData();
  };

  // ✅ LOAD MORE FIRST (IMPORTANT)
  const displayedData = data.slice(0, displayCount);

  // ✅ THEN FILTER (SEARCH)
  const finalData = search
    ? displayedData.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      )
    : displayedData;

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-6">

      {/* Header */}
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-bold">RRB Nursing Superintendent 2026</h1>

        {/* Stats */}
        <div className="mt-4 space-y-2">
          <p className="text-red-600 font-bold text-base flex items-center justify-center gap-2">
            🔥 {data.length}+ students already ranked • growing fast
            <button
              onClick={handleRefresh}
              className="text-xl hover:rotate-180 transition"
            >
              🔄
            </button>
          </p>

          {data.length > 0 && (
            <p className="flex items-center justify-center gap-2">
              🏆 Highest mark:
              <span className="text-2xl font-bold text-blue-600">
                {data[0]?.marks}
              </span>
            </p>
          )}
        </div>

        <p className="text-sm text-gray-500 mt-2">
          📊 Based on real student submissions
        </p>

        <p className="text-sm text-gray-500 mt-2">
          {zone || category ? "Filtered Results" : "All India Merit List"}
        </p>
      </div>

      {/* Search */}
      <div className="max-w-2xl mx-auto mt-4">
        <input
          type="text"
          placeholder="Type your name to find your rank instantly 🔍"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full border p-2 rounded-lg"
        />
      </div>

      {/* Filters */}
      <div className="max-w-2xl mx-auto mt-3 flex gap-2">
        <select
          className="w-full border p-2 rounded-lg"
          value={zone}
          onChange={(e) => setZone(e.target.value)}
        >
          <option value="">All Zones</option>
          {zones.map((z) => (
            <option key={z}>{z}</option>
          ))}
        </select>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border p-2 rounded-lg"
        >
          <option value="">All Categories</option>
          <option>UR</option>
          <option>OBC</option>
          <option>SC</option>
          <option>ST</option>
          <option>EWS</option>
        </select>
      </div>

      {/* Top 3 */}
      {!search && data.length >= 3 && (
        <div className="max-w-2xl mx-auto mt-6 grid grid-cols-3 gap-2 text-center">
          <div className="bg-white p-4 rounded-xl shadow">
            🥈 Rank 2
            <p>{data[1].name}</p>
            <p className="font-bold">{data[1].marks}</p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-lg border-2 border-black">
            🥇 Rank 1
            <p>{data[0].name}</p>
            <p className="font-bold">{data[0].marks}</p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            🥉 Rank 3
            <p>{data[2].name}</p>
            <p className="font-bold">{data[2].marks}</p>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="max-w-2xl mx-auto mt-6 bg-white rounded-xl shadow-sm">

        <div className="grid grid-cols-5 px-4 py-3 border-b text-sm font-medium text-gray-500">
          <span>Rank</span>
          <span>Name</span>
          <span>Marks</span>
          <span>Shift</span>
          <span>Norm</span>
        </div>

        {loading ? (
          <p className="text-center py-6">Loading...</p>
        ) : finalData.length === 0 ? (
          <p className="text-center py-6 text-gray-500">No results found</p>
        ) : (
          finalData.map((item) => {
            // ✅ GLOBAL RANK (FIXED)
            const rank = data.findIndex((d) => d.id === item.id) + 1;

            return (
              <div key={item.id} className="grid grid-cols-5 px-4 py-3 border-b">
                <span>Rank {rank}</span>
                <span className="truncate">{item.name}</span>
                <span>{item.marks}</span>
                <span>{item.shift ?? "-"}</span>
                <span>{item.normalizedMarks ?? "-"}</span>
              </div>
            );
          })
        )}
      </div>

      {/* Load More */}
      {data.length > displayCount && !search && (
        <div className="max-w-2xl mx-auto mt-4 text-center">
          <button
            onClick={handleLoadMore}
            className="px-6 py-2 bg-black text-white rounded-lg"
          >
            Load More ({data.length - displayCount} remaining)
          </button>
        </div>
      )}

      {/* CTA */}
      {showCTA && (
        <div className="max-w-2xl mx-auto mt-8 text-center">
          <p>🎯 Rank mil gaya?</p>
          <h3>Selection hoga ya nahi? 🤔</h3>
        </div>
      )}

    </main>
  );
}