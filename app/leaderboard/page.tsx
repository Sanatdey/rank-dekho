"use client";
import { useEffect, useState } from "react";

interface LeaderboardEntry {
  id: string;
  name: string;
  marks: number;
  normalizedMarks?: number;
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
  "Ahmedabad",
  "Ajmer",
  "Allahabad (Prayagraj)",
  "Bangalore",
  "Bhopal",
  "Bhubaneswar",
  "Bilaspur",
  "Chandigarh",
  "Chennai",
  "Gorakhpur",
  "Guwahati",
  "Jammu",
  "Kolkata",
  "Malda",
  "Mumbai",
  "Muzaffarpur",
  "Patna",
  "Ranchi",
  "Secunderabad",
  "Siliguri",
  "Thiruvananthapuram"
  ];

 const fetchData = () => {
  setLoading(true);
  setShowCTA(false);

  const params = new URLSearchParams();

  if (zone) params.append("zone", zone);
  if (category) params.append("category", category);

  const url = `/api/leaderboard?${params.toString()}`;

  fetch(url)
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
    setDisplayCount(20); // Reset to show first 20 on filter change
  }, [zone, category]);

  // Filter data based on search
  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  // Display only limited data
  const displayedData = filteredData.slice(0, displayCount);

  // Handle search change - reset display count
  const handleSearch = (value: string) => {
    setSearch(value);
    setDisplayCount(20);
  };

  // Load more handler
  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + 10);
  };

  // Refresh data handler
  const handleRefresh = () => {
    fetchData();
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-6">

      {/* Header */}
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-bold">RRB Nursing Superindant 2026</h1>
        
        {/* Live Stats */}
        <div className="mt-4 space-y-2">
          <p className="text-red-600 font-bold text-base flex items-center justify-center gap-2">
            🔥 {data.length}+ students already ranked • updates live{" "}
            <button
              onClick={handleRefresh}
              className="text-2xl hover:rotate-180 transition-transform duration-500 cursor-pointer"
              title="Refresh leaderboard"
            >
              🔄
            </button>
          </p>
          {data.length > 0 && (
            <p className="flex items-center justify-center gap-2">
              <span className="text-2xl">🏆</span>
              <span className="text-gray-600 font-semibold">Highest mark so far:</span>
              <span className="text-3xl font-black bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-600 bg-clip-text text-transparent">
                {data[0]?.marks}
              </span>
            </p>
          )}
        </div>

        <div className="max-w-2xl mx-auto mt-4 text-center bg-red-50 border-2 border-red-500 rounded-lg p-3">
          <p className="text-sm font-semibold text-red-700">
            ⚠️ NORMALIZATION FEATURE UNAVAILABLE
          </p>
          <p className="text-xs text-red-600 mt-1">
            Current ranking is based on raw marks only. Normalization will be added soon.
          </p>
        </div>
        <p className="text-sm text-gray-500 mt-3">
          {zone || category ? "Filtered Results" : "All India Merit List"}
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto mt-4 mb-3">
        <input
          type="text"
          placeholder="Search your name to find your rank 🔍"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full border p-2 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      {/* Filters */}
      <div className="max-w-2xl mx-auto flex gap-2">

        <select
          className="w-full border p-2 rounded-lg"
          value={zone}
          onChange={(e) => setZone(e.target.value)}
        >
          <option value="">Select Zone</option>

          {zones.map((z) => (
            <option key={z} value={z}>
              {z}
            </option>
          ))}
        </select>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="flex-1 border p-2 rounded-lg"
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
     {!search && (loading ? (
        // 🔄 Loading skeleton for top 3
        <div className="max-w-2xl mx-auto mt-6 grid grid-cols-3 gap-2 text-center">
          <div className="bg-white p-3 rounded-xl shadow-sm h-20 animate-pulse bg-gray-100"></div>
          <div className="bg-white p-4 rounded-xl shadow-md border-2 border-amber-500 h-20 animate-pulse bg-gray-100"></div>
          <div className="bg-white p-3 rounded-xl shadow-sm h-20 animate-pulse bg-gray-100"></div>
        </div>
      ) : Array.isArray(data) && data.length >= 3 ? (
        <div className="max-w-2xl mx-auto mt-6 grid grid-cols-3 gap-2 text-center">
          
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <p className="text-2xl">🥈</p>
            <p className="font-semibold text-sm mt-1">{data[1]?.name || "-"}</p>
            <p className="text-amber-600 font-bold mt-1">{data[1]?.marks || "-"}</p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-lg border-2 border-amber-500">
            <p className="text-2xl">🥇</p>
            <p className="font-semibold text-sm mt-1">{data[0]?.name || "-"}</p>
            <p className="text-red-600 font-bold mt-1">{data[0]?.marks || "-"}</p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <p className="text-2xl">🥉</p>
            <p className="font-semibold text-sm mt-1">{data[2]?.name || "-"}</p>
            <p className="text-orange-600 font-bold mt-1">{data[2]?.marks || "-"}</p>
          </div>

        </div>
      ) : null)}

      {/* Live Submission Note */}
      <p className="max-w-2xl mx-auto mt-4 text-xs text-center text-gray-600">
        📋 Your rank depends on live submissions — check frequently
      </p>

      {/* Table */}
      <div className="max-w-2xl mx-auto mt-6 bg-white rounded-xl shadow-sm">

        <div className="grid grid-cols-5 px-4 py-3 border-b text-sm font-medium text-gray-500">
          <span className="text-left">Rank</span>
          <span className="text-left">Name</span>
          <span className="text-left">Marks</span>
          <span className="text-left">Shift</span>
          <span className="text-left">Norm</span>
        </div>

        {loading ? (
          // 🔄 Loading skeleton
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="grid grid-cols-5 px-4 py-3 border-b animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-12"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-4 bg-gray-200 rounded w-12"></div>
              <div className="h-4 bg-gray-200 rounded w-8"></div>
              <div className="h-4 bg-gray-200 rounded w-10"></div>
            </div>
          ))
        ) : filteredData.length === 0 ? (
          <p className="text-center py-6 text-gray-500">
            {search ? "No results found for your search" : "No data found"}
          </p>
        ) : (
          displayedData.map((item: any) => {
            const actualRank = filteredData.findIndex((d) => d.id === item.id) + 1;
            return (
              <div key={item.id} className="grid grid-cols-5 px-4 py-3 border-b hover:bg-gray-50">
                <span className="font-semibold text-left">Rank {actualRank}</span>
                <span className="truncate text-left">{item.name}</span>
                <span className="text-left">{item.marks}</span>
                <span className="text-left">Shift {item.shift ?? "-"}</span>
                <span className="text-left">{item.normalizedMarks ?? "-"}</span>
              </div>
            );
          })
        )}
      </div>

      {/* Load More Button */}
      {!loading && filteredData.length > displayCount && (
        <div className="max-w-2xl mx-auto mt-4">
          <p className="text-xs text-gray-500 text-center mb-2">⏱️ Last updated, just now</p>
          <div className="text-center">
            <button
              onClick={handleLoadMore}
              className="px-6 py-2 bg-gradient-to-r from-amber-600 via-orange-500 to-red-600 text-white rounded-lg hover:from-amber-700 hover:via-orange-600 hover:to-red-700 transition font-semibold"
            >
              Load More ({filteredData.length - displayCount} remaining)
            </button>
          </div>
        </div>
      )}

      {/* 🔥 Sub Push */}
      {showCTA && !loading && (
        <div className="max-w-2xl mx-auto mt-8 bg-white rounded-xl shadow-sm p-5 text-center border">
          <p className="text-sm text-gray-500">🎯 Rank mil gaya?</p>
          <h3 className="text-lg font-semibold mt-1">
            Selection hoga ya nahi? 🤔
          </h3>

          <a
            href="https://www.youtube.com/watch?v=ShobN8puCuA"
            target="_blank"
            className="inline-block mt-4 bg-gradient-to-r from-amber-600 via-orange-500 to-red-600 text-white px-6 py-2 rounded-lg hover:from-amber-700 hover:via-orange-600 hover:to-red-700 transition font-semibold"
          >
            Check Cutoff Analysis 📊
          </a>
        </div>
      )}

    </main>
  );
}