export function computeIsSafe(params: {
  zone: string;
  category: string;
  zoneCategoryRank: number;
  vacancyData?: {
    zones?: Record<string, Record<string, number>>;
  };
}) {
  const { zone, category, zoneCategoryRank, vacancyData } = params;
  const zoneData = vacancyData?.zones?.[zone];
  const categoryVacancy = zoneData?.[category];

  if (!categoryVacancy) {
    return false;
  }

  return zoneCategoryRank <= categoryVacancy;
}
