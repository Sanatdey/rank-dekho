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

  const submit = async () => {
    setError("");
    setSuccess("");

    if (!form.name || !form.marks) {
      setError("Please fill all fields");
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

      setSuccess("Submitted successfully 🚀");

      setTimeout(() => {
        router.push(`/leaderboard?zone=${form.zone}&category=${form.category}`);
      }, 1200);

    } catch (err) {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-sm">

        <h1 className="text-2xl font-bold text-center">Enter Marks 🎯</h1>

        {/* 🔥 ERROR */}
        {error && (
          <p className="mt-4 text-sm text-red-500 text-center">
            {error}
          </p>
        )}

        {/* ✅ SUCCESS */}
        {success && (
          <p className="mt-4 text-sm text-green-600 text-center">
            {success}
          </p>
        )}

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
            onChange={(e) => setForm({ ...form, marks: e.target.value })}
          />


        </div>

        <button
          onClick={submit}
          disabled={loading}
          className={`w-full mt-6 py-2 rounded-lg text-white ${
            loading ? "bg-gray-400" : "bg-black"
          }`}
        >
          {loading ? "Submitting..." : "Submit & Check Rank 🚀"}
        </button>

      </div>
    </main>
  );
}