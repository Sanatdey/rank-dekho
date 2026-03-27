import Link from "next/link";
import TrackedLinkButton from "./components/TrackedLinkButton";
import TrackedExternalLink from "./components/TrackedExternalLink";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">

      {/* 🔥 HERO */}
      <section className="text-center py-12 px-4 bg-white shadow-sm">
        <h1 className="text-3xl font-bold">
          Check Your Rank Before Result 🚀
        </h1>

        <p className="mt-3 text-gray-600">
          Compare your marks with real students & see where you stand.
        </p>

        <div className="mt-6 flex justify-center gap-4">

          {/* ✅ Submit */}
          <TrackedLinkButton
            href="/submit"
            event="cta_submit_clicked"
            location="landing"
            className="bg-gradient-to-r from-amber-600 via-orange-500 to-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-amber-700 hover:via-orange-600 hover:to-red-700 transition shadow-md"
          >
            Submit Marks
          </TrackedLinkButton>

          {/* ✅ Leaderboard */}
          <TrackedLinkButton
            href="/leaderboard"
            event="cta_leaderboard_clicked"
            location="landing"
            className="border-2 border-amber-600 text-amber-700 px-8 py-3 rounded-lg font-semibold hover:bg-amber-50 transition"
          >
            View Leaderboard
          </TrackedLinkButton>

        </div>

        {/* 🎥 Video */}
        <p className="text-xs text-gray-500 mt-4">
          🎥 Full cutoff analysis →
          <TrackedExternalLink
            href="https://www.youtube.com/watch?v=ShobN8puCuA"
            event="youtube_video_clicked"
            location="landing"
            className="underline ml-1"
          >
            Watch Now
          </TrackedExternalLink>
        </p>
      </section>

      {/* 📊 VACANCY */}
      <section className="py-10 px-4 max-w-3xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">
          Latest Vacancy Overview 📢
        </h2>

        <div className="bg-white p-4 rounded-xl shadow-sm space-y-2">
          <p><b>Exam:</b> RRB Nursing Superindant 2026</p>
          <p><b>Total Posts:</b> 272</p>
          <p><b>Expected Cutoff:</b> 60–75</p>
          <p><b>Competition Level:</b> High 🔥</p>
        </div>

        <p className="text-xs text-gray-500 mt-2">
          *Independent analysis based on student data
        </p>

        <div className="mt-5 text-center">

          {/* ℹ️ Info */}
          <p className="mt-2 text-sm">
            ℹ️{" "}
            <Link
              href="/normalization-info"
              className="text-blue-600 underline"
            >
              How your marks will change after normalization
            </Link>
          </p>

          <p className="text-sm text-gray-600">
            📊 Want detailed cutoff & selection analysis?
          </p>

          {/* 📺 Channel */}
          <TrackedExternalLink
            href="https://www.youtube.com/channel/UCRy0SOk3XQCa0L0TFDuzIwQ"
            event="youtube_channel_clicked"
            location="landing"
            className="inline-block mt-2 bg-gradient-to-r from-amber-600 via-orange-500 to-red-600 text-white px-6 py-2 rounded-lg hover:from-amber-700 hover:via-orange-600 hover:to-red-700 transition font-semibold"
          >
            Check Cutoff Analysis 📊
          </TrackedExternalLink>

        </div>
      </section>

      {/* 💡 WHY */}
      <section className="py-10 px-4 bg-white">
        <h2 className="text-xl font-semibold text-center mb-6">
          Why RankDekho?
        </h2>

        <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">

          <div className="p-4 border rounded-xl">
            <h3 className="font-semibold">📊 Real Data</h3>
            <p className="text-sm text-gray-600">
              Based on actual student submissions
            </p>
          </div>

          <div className="p-4 border rounded-xl">
            <h3 className="font-semibold">⚡ Instant Rank</h3>
            <p className="text-sm text-gray-600">
              See your position immediately
            </p>
          </div>

          <div className="p-4 border rounded-xl">
            <h3 className="font-semibold">🎯 Zone Wise</h3>
            <p className="text-sm text-gray-600">
              Compare within your zone & category
            </p>
          </div>

        </div>
      </section>

      {/* 🚀 FINAL CTA */}
      <section className="text-center py-10 px-4">
        <h2 className="text-2xl font-bold">
          Ready to know your rank?
        </h2>

        <p className="text-gray-600 mt-2">
          370+ Join students already checking their position
        </p>

        <TrackedLinkButton
          href="/submit"
          event="cta_check_now_clicked"
          location="landing"
          className="mt-5 bg-gradient-to-r from-amber-600 via-orange-500 to-red-600 text-white px-8 py-3 rounded-lg hover:from-amber-700 hover:via-orange-600 hover:to-red-700 transition font-semibold"
        >
          Check Now 🔥
        </TrackedLinkButton>
      </section>

      {/* 📺 FOOTER */}
      <footer className="text-center text-xs text-gray-500 py-6">
        Built for RRB / NORCET aspirants 🚆 <br />

        <TrackedExternalLink
          href="https://www.youtube.com/channel/UCRy0SOk3XQCa0L0TFDuzIwQ"
          event="youtube_subscribe_clicked"
          location="landing"
          className="underline"
        >
          Subscribe on YouTube @VidyaDeepam
        </TrackedExternalLink>
      </footer>

    </main>
  );
}