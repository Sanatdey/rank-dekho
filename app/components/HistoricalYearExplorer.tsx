"use client";

import { useState } from "react";

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

type HistoricalYearExplorerProps = {
  rows: HistoryRow[];
};

export default function HistoricalYearExplorer({
  rows,
}: HistoricalYearExplorerProps) {
  const [selectedYear, setSelectedYear] = useState(rows[0]?.year ?? "");
  const row = rows.find((item) => item.year === selectedYear) ?? rows[0];

  if (!row) {
    return null;
  }

  return (
    <section className="w-full min-w-0 overflow-x-hidden rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-600">
            Year explorer
          </p>
          <h2 className="mt-2 text-2xl font-bold text-gray-900">
            Vacancy picture, cutoff pressure, and board behavior in one focused view
          </h2>
          <p className="mt-2 max-w-3xl text-sm text-gray-600">
            Switch between years to compare how the seat pool, cutoff band, and
            competition pattern evolved across cycles.
          </p>
        </div>

        <div className="w-full lg:w-72">
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
            Select year
          </label>
          <select
            value={selectedYear}
            onChange={(event) => setSelectedYear(event.target.value)}
            className="w-full rounded-2xl border border-orange-200 bg-white px-4 py-3 text-sm font-semibold text-gray-800 shadow-sm outline-none ring-0"
          >
            {rows.map((item) => (
              <option key={item.year} value={item.year}>
                {item.year} - {item.notice}
              </option>
            ))}
          </select>
        </div>
      </div>

      <article className="mt-6 rounded-3xl border border-gray-100 bg-gray-50 p-4 sm:p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-600">
              {row.notice}
            </p>
            <h3 className="mt-2 text-2xl font-bold text-gray-900">{row.year}</h3>
          </div>
          <div className="max-w-full self-start rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm md:w-fit md:self-auto md:rounded-full">
            {row.totalVacanciesLabel}
          </div>
        </div>

        <p className="mt-4 text-sm text-gray-700">{row.vacancyMood}</p>

        <div className="mt-4 rounded-2xl bg-gradient-to-r from-amber-50 via-orange-50 to-red-50 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-700">
            UR approx cutoff
          </p>
          <p className="mt-1 text-lg font-bold text-gray-900">{row.urApproxCutoff}</p>
        </div>

        <p className="mt-2 text-sm text-gray-600">{row.cutoffSummary}</p>

        <div className="mt-4 flex gap-3 overflow-x-auto pb-2 md:grid md:grid-cols-3 md:overflow-visible md:pb-0">
          {row.competitionBands.map((band) => (
            <div key={band.label} className="min-w-[240px] rounded-2xl bg-white p-4 shadow-sm md:min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                {band.label}
              </p>
              <p className="mt-2 text-2xl font-bold text-gray-900">{band.range}</p>
              <p className="mt-2 text-sm text-gray-600">{band.zones}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 grid gap-2">
          {row.highlights.map((highlight) => (
            <div
              key={highlight}
              className="rounded-2xl border border-orange-100 bg-white px-4 py-3 text-sm text-gray-600"
            >
              {highlight}
            </div>
          ))}
        </div>

        {row.note ? <p className="mt-4 text-xs text-gray-500">{row.note}</p> : null}
      </article>
    </section>
  );
}
