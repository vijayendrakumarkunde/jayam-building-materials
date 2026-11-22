/**
 * Civil Engineering Calculation Utilities for Construction Materials
 * Standard IS:456 & IS:383 Concrete Batching Formulas
 */

export interface SlabCalculationResult {
  slabAreaSqFt: number;
  slabVolumeCft: number;
  sandType: "river-sand" | "m-sand";
  sandTons: number;
  cementBags: number;
  aggregatesTons: number;
  tipperTrucksNeeded: number;
  estimatedSandCost: number;
  estimatedCementCost: number;
  estimatedAggregatesCost: number;
  totalEstimatedCost: number;
}

export function calculateSlabMaterials(
  lengthFt: number,
  widthFt: number,
  thicknessInches: number = 5,
  sandType: "river-sand" | "m-sand" = "river-sand"
): SlabCalculationResult {
  const l = Math.max(1, lengthFt || 0);
  const w = Math.max(1, widthFt || 0);
  const t = Math.max(1, thicknessInches || 5);

  const areaSqFt = l * w;
  // Volume in Cubic Feet (CFT)
  const volumeCft = areaSqFt * (t / 12);

  // Dry volume coefficient for concrete is 1.54 (to account for voids and compaction)
  const dryVolumeCft = volumeCft * 1.54;

  // Standard RCC Slab Mix M20 (1 : 1.5 : 3) => Total parts = 5.5
  // Cement: 1 part / 5.5. 1 bag of cement = 1.25 CFT.
  const cementCft = dryVolumeCft * (1 / 5.5);
  const cementBags = Math.ceil(cementCft / 1.25);

  // Sand: 1.5 parts / 5.5. Density ~45 kg/CFT => Tons
  const sandCft = dryVolumeCft * (1.5 / 5.5);
  const sandWeightKg = sandCft * 45;
  const sandTons = Math.ceil((sandWeightKg / 1000) * 10) / 10; // Round to 1 decimal

  // Aggregates (20mm): 3 parts / 5.5. Density ~48 kg/CFT => Tons
  const aggCft = dryVolumeCft * (3 / 5.5);
  const aggWeightKg = aggCft * 48;
  const aggregatesTons = Math.ceil((aggWeightKg / 1000) * 10) / 10;

  // 10-Wheeler Tipper capacity is 16 Tons
  const tipperTrucksNeeded = Math.ceil(sandTons / 16);

  // Rates based on Jayam Building Materials catalog:
  // River Sand @ ₹1,850/Ton, M-Sand @ ₹1,100/Ton, 53 Grade Cement @ ₹395/Bag, 20mm Aggregates @ ₹780/Ton
  const sandRate = sandType === "m-sand" ? 1100 : 1850;
  const estimatedSandCost = Math.round(sandTons * sandRate);
  const estimatedCementCost = Math.round(cementBags * 395);
  const estimatedAggregatesCost = Math.round(aggregatesTons * 780);
  const totalEstimatedCost = estimatedSandCost + estimatedCementCost + estimatedAggregatesCost;

  return {
    slabAreaSqFt: Math.round(areaSqFt),
    slabVolumeCft: Math.round(volumeCft),
    sandType,
    sandTons,
    cementBags,
    aggregatesTons,
    tipperTrucksNeeded,
    estimatedSandCost,
    estimatedCementCost,
    estimatedAggregatesCost,
    totalEstimatedCost,
  };
}

export function calculatePlasteringMaterials(
  wallAreaSqFt: number,
  thicknessMm: number = 12
) {
  const area = Math.max(1, wallAreaSqFt || 0);
  // Volume in m3: Area (m2) * (thickness / 1000)
  const areaM2 = area * 0.0929;
  const wetVolM3 = areaM2 * (thicknessMm / 1000);
  const dryVolM3 = wetVolM3 * 1.33; // 33% extra for joints & wastage

  // 1:4 Plastering Mortar => 5 parts
  const cementM3 = dryVolM3 * (1 / 5);
  // 1 bag cement = 0.035 m3
  const cementBags = Math.ceil(cementM3 / 0.035);

  // Plastering Sand: 4 parts
  const sandM3 = dryVolM3 * (4 / 5);
  // Sand density ~ 1600 kg/m3 => Tons
  const sandTons = Math.ceil(((sandM3 * 1600) / 1000) * 10) / 10;

  return {
    wallAreaSqFt: Math.round(area),
    cementBags,
    sandTons,
    estimatedCost: Math.round(cementBags * 395 + sandTons * 1350), // P-Sand @ 1350/Ton
  };
}
