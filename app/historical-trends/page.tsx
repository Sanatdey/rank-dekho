import Link from "next/link";
import HistoricalZoneExplorer from "../components/HistoricalZoneExplorer";
import HistoricalYearExplorer from "../components/HistoricalYearExplorer";

type HistoryRow = {
  year: string;
  notice: string;
  totalVacanciesLabel: string;
  totalVacanciesValue: number;
  vacancyMood: string;
  urApproxCutoff: string;
  cutoffSummary: string;
  competitionBands: Array<{
    label: string;
    range: string;
    zones: string;
  }>;
  highlights: string[];
  note?: string;
};

type ZonePair = {
  zone: string;
  in2019: number;
  in2024: number;
  in2025: number;
};

const historyRows: HistoryRow[] = [
  {
    year: "2006",
    notice: "CEN 05/2006",
    totalVacanciesLabel: "~1450 (estimated from zone split)",
    totalVacanciesValue: 1450,
    vacancyMood: "Broad distribution with several medium-to-large boards",
    urApproxCutoff: "Approx UR cutoff band: 50-65%",
    cutoffSummary: "UR cutoffs stayed in the 50-65% band depending on zone pressure.",
    competitionBands: [
      {
        label: "High pressure",
        range: "60-65%",
        zones: "Allahabad, Mumbai, Secunderabad",
      },
      {
        label: "Medium pressure",
        range: "55-60%",
        zones: "Chennai, Kolkata, Bangalore",
      },
      {
        label: "Lower pressure",
        range: "50-55%",
        zones: "Guwahati, Malda, smaller boards",
      },
    ],
    highlights: [
      "Allahabad / Prayagraj, Mumbai, and Secunderabad carried the highest vacancy loads.",
      "Smaller boards still offered meaningful entry opportunities because the cutoffs were softer.",
    ],
    note: "2006 total is inferred from the zone-wise ranges you provided.",
  },
  {
    year: "2008",
    notice: "CEN 03/2008",
    totalVacanciesLabel: "~1500",
    totalVacanciesValue: 1500,
    vacancyMood: "The network stayed wide with strong openings across the top boards.",
    urApproxCutoff: "Approx UR cutoff band: 57-66%",
    cutoffSummary: "UR cutoffs rose into the high-50s to mid-60s.",
    competitionBands: [
      {
        label: "Highest cutoff band",
        range: "64-66%",
        zones: "Allahabad, Mumbai, Secunderabad",
      },
      {
        label: "Upper-mid band",
        range: "61-64%",
        zones: "Chennai, Kolkata, Bangalore",
      },
      {
        label: "Lower-mid band",
        range: "57-60%",
        zones: "Guwahati, Malda, smaller boards",
      },
    ],
    highlights: [
      "Top five boards all crossed 100 vacancies.",
      "Even mid-tier boards like Bilaspur, Ranchi, and Bhubaneswar stayed active.",
    ],
  },
  {
    year: "2010",
    notice: "CEN 04/2010",
    totalVacanciesLabel: "~1800",
    totalVacanciesValue: 1800,
    vacancyMood: "A broad expansion phase with more room across almost every board.",
    urApproxCutoff: "Approx UR cutoff band: 59-69%",
    cutoffSummary: "UR cutoffs climbed to roughly 59-69% as the exam became more competitive.",
    competitionBands: [
      {
        label: "Highest cutoff band",
        range: "66-69%",
        zones: "Allahabad, Mumbai, Secunderabad",
      },
      {
        label: "Upper-mid band",
        range: "63-66%",
        zones: "Chennai, Kolkata, Bangalore",
      },
      {
        label: "Lower-mid band",
        range: "59-62%",
        zones: "Guwahati, Malda, smaller boards",
      },
    ],
    highlights: [
      "Large boards kept growing while second-tier zones also widened their intake.",
      "This is the first point where the total vacancy picture clearly felt nationwide and deep.",
    ],
  },
  {
    year: "2012",
    notice: "CEN 02/2012",
    totalVacanciesLabel: "~1600-1700",
    totalVacanciesValue: 1650,
    vacancyMood: "A slight normalization after 2010, but still a healthy all-India spread.",
    urApproxCutoff: "Approx UR cutoff band: 60-70%",
    cutoffSummary: "UR cutoffs stayed elevated, roughly 60-70%.",
    competitionBands: [
      {
        label: "Highest cutoff band",
        range: "67-70%",
        zones: "Allahabad, Mumbai, Secunderabad",
      },
      {
        label: "Upper-mid band",
        range: "64-67%",
        zones: "Chennai, Kolkata, Bangalore",
      },
      {
        label: "Lower-mid band",
        range: "60-63%",
        zones: "Guwahati, Malda, smaller boards",
      },
    ],
    highlights: [
      "Despite fewer seats than 2010, cutoffs stayed high because the pressure remained strong.",
      "Mid-tier zones still gave a meaningful balancing option for candidates.",
    ],
  },
  {
    year: "2014",
    notice: "CEN 04/2014",
    totalVacanciesLabel: "~2000+",
    totalVacanciesValue: 2000,
    vacancyMood: "Peak expansion across the historical set you shared.",
    urApproxCutoff: "Approx UR cutoff band: 62-72%",
    cutoffSummary: "UR cutoffs reached roughly 62-72% depending on board strength.",
    competitionBands: [
      {
        label: "Highest cutoff band",
        range: "69-72%",
        zones: "Allahabad, Mumbai, Secunderabad",
      },
      {
        label: "Upper-mid band",
        range: "66-69%",
        zones: "Chennai, Kolkata, Bangalore",
      },
      {
        label: "Lower-mid band",
        range: "62-65%",
        zones: "Guwahati, Malda, smaller boards",
      },
    ],
    highlights: [
      "2014 looks like the widest opportunity window in this historical series.",
      "Even smaller boards benefited from the broader vacancy tail.",
    ],
  },
  {
    year: "2019",
    notice: "CEN 02/2019",
    totalVacanciesLabel: "1109 official Nursing Superintendent posts",
    totalVacanciesValue: 1109,
    vacancyMood: "A narrower official window, but still strong across major zones.",
    urApproxCutoff: "Approx UR observed range: 60-74 marks",
    cutoffSummary: "Observed UR cutoff ranges tightened around 60-74 marks.",
    competitionBands: [
      {
        label: "Highest cutoff band",
        range: "71-74",
        zones: "Ajmer, Secunderabad, Ahmedabad, Mumbai",
      },
      {
        label: "Core competitive band",
        range: "67-72",
        zones: "Allahabad, Kolkata, Chennai, Chandigarh, Bangalore",
      },
      {
        label: "Lower-pressure band",
        range: "60-66",
        zones: "Jammu, Gorakhpur, Patna, Muzaffarpur, Siliguri",
      },
    ],
    highlights: [
      "Kolkata, Ajmer, Secunderabad, Mumbai, and Chennai stayed among the strongest official vacancy zones.",
      "Smaller boards like Jammu and Gorakhpur showed visibly softer cutoff bands.",
    ],
  },
  {
    year: "2024",
    notice: "CEN 04/2024",
    totalVacanciesLabel: "~713 official Nursing Superintendent posts",
    totalVacanciesValue: 713,
    vacancyMood: "The most compressed opportunity window in the set, with sharper competition.",
    urApproxCutoff: "Approx UR observed range: 65-78 marks",
    cutoffSummary: "Observed UR cutoff ranges shifted up, roughly 65-78 marks.",
    competitionBands: [
      {
        label: "Highest cutoff band",
        range: "75-78",
        zones: "Ajmer, Secunderabad, Ahmedabad, Mumbai",
      },
      {
        label: "Core competitive band",
        range: "71-76",
        zones: "Prayagraj, Kolkata, Chennai, Chandigarh, Bangalore",
      },
      {
        label: "Lower-pressure band",
        range: "65-71",
        zones: "Jammu, Gorakhpur, Patna, Muzaffarpur, Siliguri",
      },
    ],
    highlights: [
      "Vacancies fell sharply compared with 2019, especially in smaller and mid-tier boards.",
      "Cutoff pressure rose across nearly every zone because the seat pool contracted.",
    ],
  },
  {
    year: "2025",
    notice: "CEN 03/2025",
    totalVacanciesLabel: "272 placeholder-distribution posts",
    totalVacanciesValue: 272,
    vacancyMood: "A sharply compressed cycle based on the provisional zone split you provided.",
    urApproxCutoff: "Approx UR pressure outlook: very high in Chennai, Kolkata, Mumbai, Prayagraj; softer only where seats stay tiny but demand stays lower",
    cutoffSummary:
      "No dependable official cutoff range is available yet, but vacancy compression suggests a much tighter selection line than 2024 in the strongest zones.",
    competitionBands: [
      {
        label: "Highest pressure outlook",
        range: "Very high",
        zones: "Kolkata, Chennai, Mumbai, Prayagraj",
      },
      {
        label: "Upper-mid pressure",
        range: "High",
        zones: "Patna, Jammu, Bilaspur, Muzaffarpur, Siliguri",
      },
      {
        label: "Lower-volume boards",
        range: "Volatile",
        zones: "Ahmedabad, Ajmer, Bhubaneswar, Chandigarh, Secunderabad",
      },
    ],
    highlights: [
      "Kolkata, Chennai, and Mumbai still hold the most visible seat clusters even in a much smaller cycle.",
      "Boards with only a handful of seats can swing quickly because one or two rank movements matter much more.",
    ],
    note: "2025 values on this page are based on placeholder-distribution totals shared by you and should be replaced with exact official extraction later.",
  },
];

const zonePairs: ZonePair[] = [
  { zone: "Ahmedabad", in2019: 101, in2024: 64, in2025: 4 },
  { zone: "Ajmer", in2019: 125, in2024: 79, in2025: 3 },
  { zone: "Prayagraj", in2019: 91, in2024: 58, in2025: 13 },
  { zone: "Bangalore", in2019: 60, in2024: 42, in2025: 5 },
  { zone: "Bhopal", in2019: 66, in2024: 45, in2025: 5 },
  { zone: "Bhubaneswar", in2019: 30, in2024: 20, in2025: 2 },
  { zone: "Bilaspur", in2019: 70, in2024: 48, in2025: 10 },
  { zone: "Chandigarh", in2019: 93, in2024: 61, in2025: 2 },
  { zone: "Chennai", in2019: 104, in2024: 67, in2025: 43 },
  { zone: "Gorakhpur", in2019: 24, in2024: 16, in2025: 7 },
  { zone: "Guwahati", in2019: 77, in2024: 52, in2025: 7 },
  { zone: "Jammu", in2019: 23, in2024: 14, in2025: 11 },
  { zone: "Kolkata", in2019: 123, in2024: 81, in2025: 56 },
  { zone: "Malda", in2019: 41, in2024: 27, in2025: 5 },
  { zone: "Mumbai", in2019: 105, in2024: 68, in2025: 43 },
  { zone: "Muzaffarpur", in2019: 38, in2024: 25, in2025: 10 },
  { zone: "Patna", in2019: 29, in2024: 19, in2025: 23 },
  { zone: "Ranchi", in2019: 26, in2024: 18, in2025: 9 },
  { zone: "Secunderabad", in2019: 112, in2024: 73, in2025: 4 },
  { zone: "Siliguri", in2019: 39, in2024: 26, in2025: 10 },
  { zone: "Thiruvananthapuram", in2019: 34, in2024: 20, in2025: 0 },
];

const zoneCutoffMap = {
  Ahmedabad: {
    in2019: "UR approx: 71-73 marks",
    in2024: "UR approx: 75-77 marks",
    in2025: "2025 outlook: low seats, sharp volatility",
  },
  Ajmer: {
    in2019: "UR approx: 72-74 marks",
    in2024: "UR approx: 76-78 marks",
    in2025: "2025 outlook: tiny seat pool, premium pressure stays high",
  },
  Prayagraj: {
    in2019: "UR approx: 70-72 marks",
    in2024: "UR approx: 74-76 marks",
    in2025: "2025 outlook: premium zone, likely among the toughest bands",
  },
  Bangalore: {
    in2019: "UR approx: 67-69 marks",
    in2024: "UR approx: 71-73 marks",
    in2025: "2025 outlook: high pressure with fewer seats",
  },
  Bhopal: {
    in2019: "UR approx: 66-68 marks",
    in2024: "UR approx: 70-72 marks",
    in2025: "2025 outlook: small seat pool, likely high pressure",
  },
  Bhubaneswar: {
    in2019: "UR approx: 63-65 marks",
    in2024: "UR approx: 68-70 marks",
    in2025: "2025 outlook: very low volume, volatile cutoff behavior",
  },
  Bilaspur: {
    in2019: "UR approx: 65-67 marks",
    in2024: "UR approx: 70-72 marks",
    in2025: "2025 outlook: moderate seat cluster, pressure should stay elevated",
  },
  Chandigarh: {
    in2019: "UR approx: 69-71 marks",
    in2024: "UR approx: 73-75 marks",
    in2025: "2025 outlook: very low seats, premium-style squeeze",
  },
  Chennai: {
    in2019: "UR approx: 68-70 marks",
    in2024: "UR approx: 72-74 marks",
    in2025: "2025 outlook: premium zone, one of the heaviest pressure boards",
  },
  Gorakhpur: {
    in2019: "UR approx: 62-64 marks",
    in2024: "UR approx: 66-69 marks",
    in2025: "2025 outlook: smaller board, cutoff likely swings fast",
  },
  Guwahati: {
    in2019: "UR approx: 64-66 marks",
    in2024: "UR approx: 69-71 marks",
    in2025: "2025 outlook: still a lower-volume board, but pressure remains real",
  },
  Jammu: {
    in2019: "UR approx: 60-63 marks",
    in2024: "UR approx: 65-68 marks",
    in2025: "2025 outlook: moderate seat cluster, more active than many small boards",
  },
  Kolkata: {
    in2019: "UR approx: 69-72 marks",
    in2024: "UR approx: 73-76 marks",
    in2025: "2025 outlook: premium zone, likely among the top cutoff bands",
  },
  Malda: {
    in2019: "UR approx: 63-65 marks",
    in2024: "UR approx: 68-70 marks",
    in2025: "2025 outlook: low-volume board, volatile selection line",
  },
  Mumbai: {
    in2019: "UR approx: 70-73 marks",
    in2024: "UR approx: 74-77 marks",
    in2025: "2025 outlook: premium zone, pressure likely very high",
  },
  Muzaffarpur: {
    in2019: "UR approx: 62-65 marks",
    in2024: "UR approx: 67-70 marks",
    in2025: "2025 outlook: meaningful seat cluster, pressure should stay high",
  },
  Patna: {
    in2019: "UR approx: 61-64 marks",
    in2024: "UR approx: 66-69 marks",
    in2025: "2025 outlook: stronger than before, likely upper-mid pressure",
  },
  Ranchi: {
    in2019: "UR approx: 63-66 marks",
    in2024: "UR approx: 68-71 marks",
    in2025: "2025 outlook: low to mid volume, still likely tight",
  },
  Secunderabad: {
    in2019: "UR approx: 71-74 marks",
    in2024: "UR approx: 75-78 marks",
    in2025: "2025 outlook: tiny seat pool, but historic premium demand remains",
  },
  Siliguri: {
    in2019: "UR approx: 62-65 marks",
    in2024: "UR approx: 67-70 marks",
    in2025: "2025 outlook: moderate low-volume pressure, can swing quickly",
  },
  Thiruvananthapuram: {
    in2019: "UR approx: 65-67 marks",
    in2024: "UR approx: 70-72 marks",
    in2025: "2025 outlook: no placeholder seats in current split",
  },
} as const;

const comparisonCutoffCards = [
  {
    year: "2019",
    title: "Observed UR range",
    value: "60-74 marks",
    detail: "Top pressure zones clustered around 71-74 marks.",
  },
  {
    year: "2024",
    title: "Observed UR range",
    value: "65-78 marks",
    detail: "The full cutoff map shifted upward as vacancies tightened.",
  },
  {
    year: "2025",
    title: "Pressure outlook",
    value: "Likely tighter than 2024 in premium zones",
    detail: "Kolkata, Chennai, Mumbai, and Prayagraj should carry the heaviest cutoff pressure.",
  },
] as const;

const premiumCutoffSeries = [
  {
    year: "2019",
    min: 60,
    max: 74,
    fill: "from-amber-500 via-orange-500 to-orange-600",
    note: "Observed UR band",
  },
  {
    year: "2024",
    min: 65,
    max: 78,
    fill: "from-orange-500 via-red-500 to-rose-500",
    note: "Observed UR band",
  },
  {
    year: "2025",
    min: 76,
    max: 80,
    fill: "from-rose-500 via-pink-500 to-fuchsia-600",
    note: "Projected premium-zone pressure",
  },
] as const;

const cutoffChartMin = 55;
const cutoffChartMax = 82;

function cutoffLeft(value: number) {
  return ((value - cutoffChartMin) / (cutoffChartMax - cutoffChartMin)) * 100;
}

function cutoffWidth(min: number, max: number) {
  return ((max - min) / (cutoffChartMax - cutoffChartMin)) * 100;
}

const maxZoneValue = Math.max(
  ...zonePairs.flatMap((zone) => [zone.in2019, zone.in2024, zone.in2025])
);
const maxTrendValue = Math.max(...historyRows.map((row) => row.totalVacanciesValue));

function trendPolylinePoints(values: number[]) {
  return values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * 100;
      const y = 100 - (value / maxTrendValue) * 100;
      return `${x},${y}`;
    })
    .join(" ");
}

function yearLabelPosition(index: number, total: number) {
  return `${(index / (total - 1)) * 100}%`;
}

function shortTrendLabel(row: HistoryRow, total2025: number) {
  if (row.year === "2025") {
    return `${total2025} posts`;
  }

  if (row.year === "2019") {
    return "1109 posts";
  }

  if (row.year === "2024") {
    return "713 posts";
  }

  return row.totalVacanciesLabel.replace(" (estimated from zone split)", "");
}

function ChevronDownIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      className={className}
    >
      <path
        d="M5 7.5 10 12.5 15 7.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function HistoricalTrendsPage() {
  const vacancyDrop =
    Math.round(
      ((historyRows[historyRows.length - 2].totalVacanciesValue -
        historyRows[historyRows.length - 1].totalVacanciesValue) /
        historyRows[historyRows.length - 2].totalVacanciesValue) *
        100
    );
  const total2025 = zonePairs.reduce((sum, zone) => sum + zone.in2025, 0);
  const latestRow = historyRows[historyRows.length - 1];

  return (
    <main className="min-h-screen w-full min-w-0 overflow-x-hidden bg-gray-50 px-3 py-6 sm:px-4 sm:py-8">
      <div className="mx-auto w-full min-w-0 max-w-6xl space-y-5 sm:space-y-6">
        <section className="w-full min-w-0 overflow-hidden rounded-[28px] border border-orange-100 bg-white shadow-sm">
          <div className="bg-gradient-to-r from-amber-600 via-orange-500 to-red-600 px-4 py-7 text-white sm:px-6 sm:py-10">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-orange-100">
              Historical trend deck
            </p>
            <h1 className="mt-3 max-w-3xl text-2xl font-bold leading-tight sm:text-4xl lg:text-5xl">
              RRB Nursing Superintendent trend map from 2006 to 2025
            </h1>
            <p className="mt-4 max-w-3xl text-sm text-orange-50 sm:text-base">
              A fast visual read of how vacancies tightened, which zones stayed
              consistently strong, and how cutoff pressure evolved from the wide
              opportunity years to the 2025 squeeze.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/submit"
                className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-orange-700 shadow-sm"
              >
                Check your rank
              </Link>
              <Link
                href="/leaderboard"
                className="rounded-full border border-orange-200 px-5 py-2 text-sm font-semibold text-white"
              >
                View live leaderboard
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 px-4 py-4 sm:gap-4 sm:px-6 sm:py-6 md:grid-cols-4">
            <div className="rounded-2xl bg-amber-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
                Years covered
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900">8</p>
              <p className="mt-2 text-sm text-gray-600">2006, 2008, 2010, 2012, 2014, 2019, 2024, 2025</p>
            </div>
            <div className="rounded-2xl bg-orange-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-700">
                Peak vacancy era
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900">2014</p>
              <p className="mt-2 text-sm text-gray-600">Around 2000+ seats across the network.</p>
            </div>
            <div className="rounded-2xl bg-red-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-700">
                2024 to 2025 drop
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{vacancyDrop}%</p>
              <p className="mt-2 text-sm text-gray-600">The provisional 2025 pool is dramatically tighter than 2024.</p>
            </div>
            <div className="rounded-2xl bg-gray-900 p-4 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-300">
                2025 flashpoint
              </p>
              <p className="mt-2 text-2xl font-bold">Kolkata, Chennai, Mumbai</p>
              <p className="mt-2 text-sm text-gray-300">
                Even in a compressed cycle, these zones still carry the heaviest seat concentration.
              </p>
            </div>
          </div>
        </section>

        <section className="grid w-full min-w-0 gap-6 lg:grid-cols-[1.4fr_0.9fr]">
          <div className="min-w-0 rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-600">
                  Vacancy trend
                </p>
                <h2 className="mt-2 max-w-3xl text-2xl font-bold text-gray-900">
                  Opportunity widened through 2014, then narrowed hard through 2025
                </h2>
              </div>
              <div className="max-w-full self-start rounded-2xl bg-orange-50 px-4 py-2 text-xs font-semibold text-orange-700 sm:w-fit sm:rounded-full">
                Approximate totals shown where official all-India count was not supplied
              </div>
            </div>

            <div className="mt-8 min-w-0 rounded-3xl bg-gradient-to-b from-orange-50 via-white to-white p-4">
              <div className="relative h-72 overflow-hidden sm:h-80">
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
                  <defs>
                    <linearGradient id="vacancyStroke" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#d97706" />
                      <stop offset="50%" stopColor="#f97316" />
                      <stop offset="100%" stopColor="#dc2626" />
                    </linearGradient>
                    <linearGradient id="vacancyFill" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="rgba(249,115,22,0.24)" />
                      <stop offset="100%" stopColor="rgba(249,115,22,0.03)" />
                    </linearGradient>
                  </defs>

                  {[20, 40, 60, 80].map((line) => (
                    <line
                      key={line}
                      x1="0"
                      y1={line}
                      x2="100"
                      y2={line}
                      stroke="#f1f5f9"
                      strokeWidth="0.6"
                    />
                  ))}

                  <polyline
                    fill="url(#vacancyFill)"
                    stroke="none"
                    points={`0,100 ${trendPolylinePoints(
                      historyRows.map((row) => row.totalVacanciesValue)
                    )} 100,100`}
                  />

                  <polyline
                    fill="none"
                    stroke="url(#vacancyStroke)"
                    strokeWidth="2.2"
                    points={trendPolylinePoints(historyRows.map((row) => row.totalVacanciesValue))}
                  />

                  {historyRows.map((row, index) => {
                    const x = (index / (historyRows.length - 1)) * 100;
                    const y = 100 - (row.totalVacanciesValue / maxTrendValue) * 100;

                    return (
                      <circle
                        key={row.year}
                        cx={x}
                        cy={y}
                        r="2.2"
                        fill="#ffffff"
                        stroke="#ea580c"
                        strokeWidth="1.5"
                      />
                    );
                  })}
                </svg>

                <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden sm:block">
                  {historyRows.map((row, index) => (
                    <div
                      key={row.year}
                      className={`absolute text-center ${
                        index === 0
                          ? "left-0"
                          : index === historyRows.length - 1
                            ? "right-0 left-auto"
                            : "-translate-x-1/2"
                      }`}
                      style={
                        index === 0
                          ? undefined
                          : index === historyRows.length - 1
                            ? undefined
                            : { left: yearLabelPosition(index, historyRows.length) }
                      }
                    >
                      <p className="text-xs font-semibold text-gray-800">{row.year}</p>
                      <p className="hidden text-[11px] text-gray-500 sm:block">
                        {row.year === "2025" ? `${total2025} total` : row.totalVacanciesLabel}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-3 flex gap-2 overflow-x-auto pb-1 sm:hidden">
              {historyRows.map((row) => (
                <div
                  key={row.year}
                  className="min-w-[112px] rounded-2xl border border-orange-100 bg-white px-3 py-2 shadow-sm"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-orange-600">
                    {row.year}
                  </p>
                  <p className="mt-1 text-[11px] text-gray-600">
                    {shortTrendLabel(row, total2025)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden min-w-0 rounded-[28px] border border-gray-200 bg-white p-6 shadow-sm lg:block">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-600">
              Pattern summary
            </p>
            <h2 className="mt-2 text-2xl font-bold text-gray-900">
              What stays true across almost every cycle
            </h2>

            <div className="mt-6 space-y-4">
              {[
                {
                  title: "Top vacancy centers stay familiar",
                  body: "Prayagraj, Mumbai, Secunderabad, Chennai, and Kolkata keep returning as the backbone boards.",
                },
                {
                  title: "Smaller boards shape the cutoff floor",
                  body: "Guwahati, Malda, Jammu, Gorakhpur, Siliguri, and similar boards repeatedly soften the lower end of the cutoff map.",
                },
                {
                  title: "Seat compression raises cutoff pressure quickly",
                  body: "The 2019 to 2024 drop shows how fewer seats can lift cutoffs even when the zone hierarchy remains similar.",
                },
                {
                  title: "Vacancy and cutoff do not move in a straight line",
                  body: "Big boards still have tough cutoffs because candidate preference and concentration matter, not just raw seat count.",
                },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-orange-100 bg-orange-50/50 p-4">
                  <p className="font-semibold text-gray-900">{item.title}</p>
                  <p className="mt-2 text-sm text-gray-600">{item.body}</p>
                </div>
              ))}
            </div>
          </div>

          <details className="min-w-0 rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm lg:hidden group">
            <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold uppercase tracking-[0.22em] text-orange-600">
              <span>Pattern summary</span>
              <ChevronDownIcon className="h-5 w-5 text-orange-500 transition-transform group-open:rotate-180" />
            </summary>
            <div className="mt-4 space-y-3">
              {[
                {
                  title: "Top vacancy centers stay familiar",
                  body: "Prayagraj, Mumbai, Secunderabad, Chennai, and Kolkata keep returning as the backbone boards.",
                },
                {
                  title: "Smaller boards shape the cutoff floor",
                  body: "Guwahati, Malda, Jammu, Gorakhpur, Siliguri, and similar boards repeatedly soften the lower end of the cutoff map.",
                },
                {
                  title: "Seat compression raises cutoff pressure quickly",
                  body: "The 2019 to 2024 drop shows how fewer seats can lift cutoffs even when the zone hierarchy remains similar.",
                },
                {
                  title: "Vacancy and cutoff do not move in a straight line",
                  body: "Big boards still have tough cutoffs because candidate preference and concentration matter, not just raw seat count.",
                },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-orange-100 bg-orange-50/50 p-4">
                  <p className="font-semibold text-gray-900">{item.title}</p>
                  <p className="mt-2 text-sm text-gray-600">{item.body}</p>
                </div>
              ))}
            </div>
          </details>
        </section>

        <section className="w-full min-w-0 rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-600">
                Official zone comparison
              </p>
              <h2 className="mt-2 text-2xl font-bold text-gray-900">
                2019 vs 2024 vs 2025 Nursing Superintendent vacancies by zone
              </h2>
            </div>
            <p className="max-w-2xl text-sm text-gray-600">
              2025 is shown using your placeholder-distribution totals for CEN 03/2025,
              so this block works as a directional comparison rather than a final official trendline.
            </p>
          </div>

          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            2025 snapshot total in this comparison: <span className="font-semibold">{total2025}</span> posts.
            The page treats it as provisional because your source note says exact PDF values should replace it later.
          </div>

          <div className="mt-4 flex gap-3 overflow-x-auto pb-1 md:grid md:grid-cols-3 md:overflow-visible md:pb-0">
            {comparisonCutoffCards.map((card) => (
              <div key={card.year} className="min-w-[260px] rounded-2xl border border-orange-100 bg-white p-4 shadow-sm md:min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-600">
                  {card.year}
                </p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">
                  {card.title}
                </p>
                <p className="mt-2 text-lg font-bold text-gray-900">{card.value}</p>
                <p className="mt-2 text-sm text-gray-600">{card.detail}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-sm">
            <div className="bg-gradient-to-r from-gray-950 via-slate-900 to-gray-950 px-5 py-5 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-200">
                Premium cutoff comparison
              </p>
              <div className="mt-2 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <h3 className="text-2xl font-bold">How the UR pressure band has shifted</h3>
                  <p className="mt-2 max-w-2xl text-sm text-slate-300">
                    2019 and 2024 use observed ranges. 2025 is shown as a projected
                    premium-zone pressure band so users can feel the likely squeeze without
                    treating it as an exact official cutoff.
                  </p>
                </div>
                <div className="max-w-full self-start rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-orange-100 sm:w-fit sm:rounded-full">
                  Axis: {cutoffChartMin} to {cutoffChartMax} marks
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-b from-white via-orange-50/40 to-white px-5 py-6">
              <div className="mb-6 hidden grid-cols-[140px_1fr] gap-4 text-xs font-semibold uppercase tracking-[0.16em] text-gray-400 md:grid">
                <div>Year</div>
                <div className="relative h-6">
                  {[55, 60, 65, 70, 75, 80].map((tick) => (
                    <span
                      key={tick}
                      className="absolute -translate-x-1/2"
                      style={{ left: `${cutoffLeft(tick)}%` }}
                    >
                      {tick}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-5">
                {premiumCutoffSeries.map((series) => (
                  <div key={series.year} className="grid gap-3 md:grid-cols-[140px_1fr] md:items-center">
                    <div>
                      <p className="text-lg font-bold text-gray-900">{series.year}</p>
                      <p className="text-xs uppercase tracking-[0.16em] text-gray-500">{series.note}</p>
                    </div>

                    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                      <div className="relative h-5 rounded-full bg-gray-200">
                        {[60, 65, 70, 75, 80].map((tick) => (
                          <span
                            key={tick}
                            className="absolute top-0 h-5 w-px bg-white/80"
                            style={{ left: `${cutoffLeft(tick)}%` }}
                          />
                        ))}

                        <div
                          className={`absolute top-0 h-5 rounded-full bg-gradient-to-r ${series.fill} shadow-[0_10px_30px_rgba(249,115,22,0.28)]`}
                          style={{
                            left: `${cutoffLeft(series.min)}%`,
                            width: `${cutoffWidth(series.min, series.max)}%`,
                          }}
                        />
                      </div>

                      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm">
                        <span className="font-semibold text-gray-900">
                          {series.year === "2025"
                            ? `${series.min}-${series.max} projected in premium zones`
                            : `${series.min}-${series.max} marks`}
                        </span>
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-gray-600 shadow-sm">
                          {series.min} → {series.max}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <HistoricalZoneExplorer
            zonePairs={zonePairs}
            cutoffMap={zoneCutoffMap}
            maxZoneValue={maxZoneValue}
          />
        </section>

        <section className="grid w-full min-w-0 gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <HistoricalYearExplorer rows={historyRows} />

          <div className="space-y-6">
            <section className="hidden rounded-[28px] border border-gray-200 bg-white p-6 shadow-sm lg:block">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-600">
                Reading the trend
              </p>
              <h2 className="mt-2 text-2xl font-bold text-gray-900">
                Quick takeaways for present-day positioning
              </h2>

              <div className="mt-6 space-y-4">
                <div className="rounded-2xl bg-amber-50 p-4">
                  <p className="font-semibold text-gray-900">High-vacancy does not mean easy</p>
                  <p className="mt-2 text-sm text-gray-600">
                    Prayagraj, Mumbai, Secunderabad, and Kolkata keep drawing more competition even when they also offer more posts.
                  </p>
                </div>
                <div className="rounded-2xl bg-orange-50 p-4">
                  <p className="font-semibold text-gray-900">Smaller zones shape the fallback map</p>
                  <p className="mt-2 text-sm text-gray-600">
                    Boards like Guwahati, Malda, Jammu, and Gorakhpur repeatedly show softer floors, especially in tighter years.
                  </p>
                </div>
              <div className="rounded-2xl bg-red-50 p-4">
                  <p className="font-semibold text-gray-900">2025 pushes the squeeze even further</p>
                  <p className="mt-2 text-sm text-gray-600">
                    With only {latestRow.totalVacanciesValue} provisional posts in this view, the live rank movement will feel much sharper zone by zone.
                  </p>
                </div>
              </div>
            </section>

            <details className="rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm lg:hidden group">
              <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold uppercase tracking-[0.22em] text-orange-600">
                <span>Reading the trend</span>
                <ChevronDownIcon className="h-5 w-5 text-orange-500 transition-transform group-open:rotate-180" />
              </summary>
              <div className="mt-4 space-y-4">
                <div className="rounded-2xl bg-amber-50 p-4">
                  <p className="font-semibold text-gray-900">High-vacancy does not mean easy</p>
                  <p className="mt-2 text-sm text-gray-600">
                    Prayagraj, Mumbai, Secunderabad, and Kolkata keep drawing more competition even when they also offer more posts.
                  </p>
                </div>
                <div className="rounded-2xl bg-orange-50 p-4">
                  <p className="font-semibold text-gray-900">Smaller zones shape the fallback map</p>
                  <p className="mt-2 text-sm text-gray-600">
                    Boards like Guwahati, Malda, Jammu, and Gorakhpur repeatedly show softer floors, especially in tighter years.
                  </p>
                </div>
                <div className="rounded-2xl bg-red-50 p-4">
                  <p className="font-semibold text-gray-900">2025 pushes the squeeze even further</p>
                  <p className="mt-2 text-sm text-gray-600">
                    With only {latestRow.totalVacanciesValue} provisional posts in this view, the live rank movement will feel much sharper zone by zone.
                  </p>
                </div>
              </div>
            </details>

            <section className="rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-600">
                Subscribe for the next shift
              </p>
              <h2 className="mt-2 text-2xl font-bold text-gray-900">
                Seats shrink. Pressure rises. Missing one update can feel expensive.
              </h2>

              <div className="mt-5 rounded-3xl bg-gradient-to-br from-amber-50 via-white to-red-50 p-5">
                <p className="text-sm leading-6 text-gray-700">
                  If your marks are sitting near the edge, the hardest part is not the exam anymore.
                  It is the waiting. Every new submission, every normalization update, and every zone trend
                  changes how safe your position feels. Stay close to the updates so you are not guessing alone.
                </p>

                <div className="mt-5 flex flex-col gap-3">
                  <a
                    href="https://www.youtube.com/@VidyaDeepamOfficial?sub_confirmation=1"
                    target="_blank"
                    className="rounded-2xl bg-gradient-to-r from-amber-600 via-orange-500 to-red-600 px-5 py-3 text-center font-semibold text-white"
                  >
                    Subscribe for daily cutoff updates
                  </a>
                  <Link
                    href="/submit"
                    className="rounded-2xl border border-orange-200 px-5 py-3 text-center font-semibold text-orange-700"
                  >
                    Submit marks and track your live rank
                  </Link>
                  <Link
                    href="/leaderboard"
                    className="rounded-2xl border border-gray-200 px-5 py-3 text-center font-semibold text-gray-700"
                  >
                    Watch the live leaderboard move
                  </Link>
                </div>
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
