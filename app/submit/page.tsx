"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SubmitPage() {

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

  const router = useRouter();

  const [form, setForm] = useState({
  name: "",
  marks: "",
  zone: "Kolkata",
  category: "UR",
  shift: "1", // 👈 ADD
  exam: "RRB-2026",
});

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [userRank, setUserRank] = useState<{
    overall: number;
    zoneCategory: number;
    shiftZoneCategory: number;
  } | null>(null);
  const [submittedData, setSubmittedData] = useState<any>(null);

  const submit = async () => {
    if (loading) return; // Prevent double-click

    setError("");
    setSuccess("");

    if (!form.name || !form.marks) {
      setError("Please fill all fields");
      return;
    }

    const marks = Number(form.marks);
    if (marks < 0 || marks > 300) {
      setError("Marks must be between 0 and 300");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/submit", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          normalizedMarks: Number(form.marks) * 1.1,
        }),
      });

      if (!res.ok) {
        throw new Error("Submission failed");
      }

      // Fetch all leaderboard data for calculations
      const allRes = await fetch("/api/leaderboard");
      const allData = await allRes.json();

      // Fetch zone & category filtered data
      const params1 = new URLSearchParams();
      params1.append("zone", form.zone);
      params1.append("category", form.category);
      const zoneCtgRes = await fetch(`/api/leaderboard?${params1.toString()}`);
      const zoneCtgData = await zoneCtgRes.json();

      // Fetch shift, zone & category filtered data
      const params2 = new URLSearchParams();
      params2.append("zone", form.zone);
      params2.append("category", form.category);
      params2.append("shift", form.shift);
      const fullFilterRes = await fetch(`/api/leaderboard?${params2.toString()}`);
      const fullFilterData = await fullFilterRes.json();

      // Calculate ranks for each filter
      const userMarks = Number(form.marks);
      const overallRank = allData.filter((item: any) => item.marks > userMarks).length + 1;
      const zoneCtgRank = zoneCtgData.filter((item: any) => item.marks > userMarks).length + 1;
      const shiftZoneCtgRank = fullFilterData.filter((item: any) => item.marks > userMarks).length + 1;

      // Store submitted data before resetting form
      setSubmittedData({
        zone: form.zone,
        category: form.category,
        shift: form.shift,
      });

      setUserRank({
        overall: overallRank,
        zoneCategory: zoneCtgRank,
        shiftZoneCategory: shiftZoneCtgRank,
      });

      setSuccess("Submitted successfully 🚀");
      setLoading(false); // Reset loading to show success state

      // Reset form data
      setForm({
        name: "",
        marks: "",
        zone: "Kolkata",
        category: "UR",
        shift: "1",
        exam: "RRB-2026",
      });

      // Don't redirect automatically - let user click to go to leaderboard

    } catch (err) {
      setError("Something went wrong. Try again.");
      setLoading(false); // Re-enable button only on error
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-sm">

        <h1 className="text-2xl font-bold text-center py-2">
          <span className="bg-gradient-to-r from-amber-600 via-orange-500 to-red-600 bg-clip-text text-transparent">
            Know Your<br />All-India Rank
          </span>
          <span className="ml-2">📊</span>
        </h1>

        {/* 🔥 ERROR */}
        {error && (
          <p className="mt-4 text-sm text-red-500 text-center">
            {error}
          </p>
        )}

        {/* ✅ SUCCESS */}
        {success && (
          <div className="mt-4 p-4 bg-green-50 border-2 border-green-500 rounded-lg text-center space-y-3">
            <p className="text-sm text-green-700 font-semibold">{success}</p>
            {userRank && (
              <>
                <div className="text-lg font-bold text-transparent bg-gradient-to-r from-amber-600 via-orange-500 to-red-600 bg-clip-text">
                  🎯 All-India Rank: #{userRank.overall}
                </div>
                <div className="text-sm font-semibold text-amber-700 bg-amber-50 p-2 rounded">
                  📍 {submittedData?.zone} + {submittedData?.category} Rank #{userRank.zoneCategory}
                </div>
                <div className="text-sm font-semibold text-orange-700 bg-orange-50 p-2 rounded">
                  🔄 {submittedData?.zone} + {submittedData?.category} & Shift {submittedData?.shift} Rank #{userRank.shiftZoneCategory}
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => router.push(`/leaderboard?zone=${submittedData?.zone}&category=${submittedData?.category}`)}
                    className="w-full py-2 rounded-lg text-white font-semibold bg-gradient-to-r from-amber-600 via-orange-500 to-red-600 hover:from-amber-700 hover:via-orange-600 hover:to-red-700 transition"
                  >
                    View Leaderboard 🏆
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {!success && (
          <>
            <div className="mt-6 space-y-4">
              <select
                value="RRB-2026"
                disabled
                className="w-full border p-2 rounded-lg bg-gray-100 text-gray-600"
              >
                <option>RRB-2026</option>
              </select>
              <input
                placeholder="Name"
                className="w-full border p-2 rounded-lg"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />

              <select
                className="w-full border p-2 rounded-lg"
                value={form.zone}
                onChange={(e) => setForm({ ...form, zone: e.target.value })}
              >
                <option value="">Select Zone</option>

                {zones.map((z) => (
                  <option key={z} value={z}>
                    {z}
                  </option>
                ))}
              </select>

              <select
                className="w-full border p-2 rounded-lg"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                <option>UR</option>
                <option>OBC</option>
                <option>SC</option>
                <option>ST</option>
                <option>EWS</option>
              </select>

              <select
                className="w-full border p-2 rounded-lg"
                onChange={(e) => setForm({ ...form, shift: e.target.value })}
                >
                <option value="1">Shift 1</option>
                <option value="2">Shift 2</option>
                <option value="3">Shift 3</option>
              </select>

              <input
                placeholder="Marks"
                type="number"
                className="w-full border p-2 rounded-lg"
                value={form.marks}
                onChange={(e) => setForm({ ...form, marks: e.target.value })}
              />
            </div>

            <button
              onClick={submit}
              disabled={loading}
              className={`w-full mt-6 py-2 rounded-lg text-white font-semibold transition ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-amber-600 via-orange-500 to-red-600 hover:from-amber-700 hover:via-orange-600 hover:to-red-700"
              }`}
            >
              {loading ? "Submitting..." : "Submit & Check Rank 🚀"}
            </button>
          </>
        )}

      </div>
    </main>
  );
}