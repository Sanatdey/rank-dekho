"use client";
import { useEffect, useState } from "react";

interface LeaderboardEntry {
  id: string;
  name: string;
  marks: number;
  normalizedMarks?: number;
  shift?: string;
  rank?: number;
}

export default function Leaderboard() {
  const [zone, setZone] = useState("");
  const [category, setCategory] = useState("");

  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");

  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const [searchResults, setSearchResults] = useState<LeaderboardEntry[]>([]);

  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const [lastId, setLastId] = useState<string | null>(null);
  const [stats, setStats] = useState({ totalUsers: 0, highestMarks: 0 });

  const zones = [
    "Ahmedabad","Ajmer","Allahabad (Prayagraj)","Bangalore","Bhopal",
    "Bhubaneswar","Bilaspur","Chandigarh","Chennai","Gorakhpur",
    "Guwahati","Jammu","Kolkata","Malda","Mumbai","Muzaffarpur",
    "Patna","Ranchi","Secunderabad","Siliguri","Thiruvananthapuram"
  ];

  const LIMIT = 30;

  const fetchStats = async () => {
    const res = await fetch("/api/stats");
    const json = await res.json();
    setStats(json);
  };

  const fetchData = async (loadMore = false) => {
    setLoading(true);

    if (!loadMore) {
      setData([]);
      setLastId(null);
    }

    const params = new URLSearchParams();
    if (zone) params.append("zone", zone);
    if (category) params.append("category", category);
    if (loadMore && lastId) params.append("lastId", lastId);

    const res = await fetch(`/api/leaderboard?${params}`);
    const json = await res.json();

    if (loadMore) {
      setData((prev) => [...prev, ...json.data]);
    } else {
      setData(json.data);
    }

    setLastId(json.lastId);
    setLoading(false);
  };

  const handleSearch = async () => {
    if (!input.trim()) return;

    setSearch(input);
    setSearchLoading(true);

    const res = await fetch(`/api/search?name=${input}`);
    const json = await res.json();
    setSearchResults(json);

    setSearchLoading(false);
  };

  const clearSearch = () => {
    setSearch("");
    setInput("");
    setSearchResults([]);
  };

  useEffect(() => {
    fetchStats();
    fetchData();
  }, [zone, category]);

  const finalData = search ? searchResults : data;

  const userRank = searchResults[0]?.rank;

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-6">

      {/* HEADER */}
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-bold">
          RRB Nursing Superintendent 2026
        </h1>

        <p className="text-red-600 font-bold mt-3">
          🔥 {stats.totalUsers}+ students already ranked
        </p>

        <p className="mt-2">
          🏆 Highest mark:
          <span className="text-xl font-bold text-blue-600 ml-2">
            {stats.highestMarks}
          </span>
        </p>
      </div>

      {/* SEARCH */}
      <div className="max-w-2xl mx-auto mt-4 flex gap-2">
        <input
          type="text"
          placeholder="Type your name..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="w-full border p-2 rounded-lg"
        />

        <button
          onClick={handleSearch}
          className="px-4 bg-gradient-to-r from-amber-600 via-orange-500 to-red-600 text-white rounded-lg font-semibold"
        >
          Search
        </button>

        {search && (
          <button onClick={clearSearch} className="px-3 border rounded-lg">
            ✕
          </button>
        )}
      </div>

      {/* 🎯 USER RANK */}
      {search && userRank && (
        <div className="max-w-2xl mx-auto mt-4 bg-yellow-100 border border-yellow-300 p-3 rounded-lg text-center font-semibold">
          🎯 Your Rank: {userRank}
        </div>
      )}

      {/* FILTERS */}
      {!search && (
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
      )}

      {/* TABLE */}
      <div className="max-w-2xl mx-auto mt-6 bg-white rounded-xl shadow-sm">

        <div className="grid grid-cols-5 px-4 py-3 border-b text-sm font-medium text-gray-500">
          <span>Rank</span>
          <span>Name</span>
          <span>Marks</span>
          <span>Shift</span>
          <span>Norm</span>
        </div>

        {(loading && !search) || searchLoading ? (
          [...Array(6)].map((_, i) => (
            <div key={i} className="grid grid-cols-5 px-4 py-3 animate-pulse">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          ))
        ) : finalData.length === 0 ? (
          <p className="text-center py-6 text-gray-500">No results found</p>
        ) : (
          finalData.map((item, index) => {
            const rank = search ? item.rank : index + 1;
            const highlight = search && index === 0;

            return (
              <div
                key={item.id}
                className={`grid grid-cols-5 px-4 py-3 border-b ${
                  highlight ? "bg-yellow-50 border-yellow-300" : ""
                }`}
              >
                <span>{rank ? `Rank ${rank}` : "—"}</span>
                <span className="truncate font-medium">{item.name}</span>
                <span>{item.marks}</span>
                <span>{item.shift ?? "-"}</span>
                <span>{item.normalizedMarks ?? "-"}</span>
              </div>
            );
          })
        )}
      </div>

      {/* LOAD MORE */}
      {!search && lastId && data.length >= LIMIT && (
        <div className="max-w-2xl mx-auto mt-4 text-center">
          <button
            onClick={() => fetchData(true)}
            disabled={loading}
            className="px-6 py-2 bg-gradient-to-r from-amber-600 via-orange-500 to-red-600 text-white rounded-lg font-semibold disabled:opacity-50"
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}

      { (
        <div className="max-w-2xl mx-auto mt-8 bg-white rounded-xl shadow-sm p-5 text-center border">
          <p className="text-sm text-gray-500">🎯 Rank mil gaya?</p>
          <h3 className="text-lg font-semibold mt-1">
            Selection hoga ya nahi? 🤔
          </h3>

          <a
            href="https://www.youtube.com/@VidyaDeepamOfficial"
            target="_blank"
            className="inline-block mt-4 bg-gradient-to-r from-amber-600 via-orange-500 to-red-600 text-white px-6 py-2 rounded-lg hover:from-amber-700 hover:via-orange-600 hover:to-red-700 transition font-semibold"
          >
            📊 Daily updates on YouTube 📊
          </a>
        </div>
      )}
    </main>
  );
}