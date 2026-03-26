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
  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const [showCTA, setShowCTA] = useState(false);

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
  const params = new URLSearchParams();

  if (zone) params.append("zone", zone);
  if (category) params.append("category", category);

  const url = `/api/leaderboard?${params.toString()}`;

  fetch(url)
    .then((res) => res.json())
    .then((res) => {
      setData(res);
      setTimeout(() => setShowCTA(true), 1200);
    })
    .catch(() => setData([]));
};

  useEffect(() => {
    fetchData();
  }, [zone, category]);

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-6">

      {/* Header */}
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-2xl font-bold">Leaderboard 🏆</h1>
        <div className="max-w-2xl mx-auto mt-4 text-center">
          <p className="text-xs text-gray-500">
            ⚠️ Normalization feature coming soon. Current ranking is based on raw marks.
          </p>
        </div>
        <p className="text-sm text-gray-500">
          {zone || category ? "Filtered Results" : "All India Merit List"}
        </p>
      </div>

      {/* Filters */}
      <div className="max-w-2xl mx-auto mt-4 flex gap-2">

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
     {Array.isArray(data) && data.length >= 3 && (
        <div className="max-w-2xl mx-auto mt-6 grid grid-cols-3 gap-2 text-center">
          
          <div className="bg-white p-3 rounded-xl shadow-sm">
            🥈 {data[1]?.name || "-"}
          </div>

          <div className="bg-white p-4 rounded-xl shadow-md border-2 border-black">
            🥇 {data[0]?.name || "-"}
          </div>

          <div className="bg-white p-3 rounded-xl shadow-sm">
            🥉 {data[2]?.name || "-"}
          </div>

        </div>
      )}
      {/* Table */}
      <div className="max-w-2xl mx-auto mt-6 bg-white rounded-xl shadow-sm">

        <div className="grid grid-cols-4 px-4 py-3 border-b text-sm font-medium text-gray-500">
          <span>Rank</span>
          <span>Name</span>
          <span>Marks</span>
          <span>Norm</span>
        </div>

        {data.map((item: any, i) => (
          <div key={item.id} className="grid grid-cols-4 px-4 py-3 border-b">
            <span>#{i + 1}</span>
            <span className="truncate">{item.name}</span>
            <span>{item.marks}</span>
            <span>{item.normalizedMarks ?? "-"}</span>
          </div>
        ))}

        {data.length === 0 && (
          <p className="text-center py-6 text-gray-500">No data found</p>
        )}
      </div>

      {/* 🔥 Sub Push */}
      {showCTA && (
        <div className="max-w-2xl mx-auto mt-8 bg-white rounded-xl shadow-sm p-5 text-center border">
          <p className="text-sm text-gray-500">🎯 Rank mil gaya?</p>
          <h3 className="text-lg font-semibold mt-1">
            Selection hoga ya nahi? 🤔
          </h3>

          <a
            href="https://www.youtube.com/watch?v=ShobN8puCuA"
            target="_blank"
            className="inline-block mt-4 bg-black text-white px-6 py-2 rounded-lg"
          >
            Watch Analysis 🔥
          </a>
        </div>
      )}

    </main>
  );
}