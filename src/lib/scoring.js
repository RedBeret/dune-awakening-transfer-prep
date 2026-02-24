export const DEFAULT_WEIGHTS = {
  freeCapacity: 45,
  activePopulation: 20,
  regionMatch: 15,
  statusPenalty: 40,
  occupancyTarget: 20
};

export function occupancyRatio(world) {
  if (!world?.capacity) return 0;
  return Math.max(0, Math.min(1, world.players / world.capacity));
}

function regionScore(world, preferredRegion) {
  if (!preferredRegion || preferredRegion === 'ANY') return 0;
  return world.region === preferredRegion ? 1 : 0;
}

function occupancyTargetBonus(ratio) {
  // Peak bonus around 45% to 70% occupancy.
  const center = 0.58;
  const distance = Math.abs(ratio - center);
  return Math.max(0, 1 - distance / 0.58);
}

export function scoreServer(world, prefs = {}, weights = DEFAULT_WEIGHTS) {
  const ratio = occupancyRatio(world);

  const freeCapacityScore = (1 - ratio) * weights.freeCapacity;
  const activePopulationScore = ratio * weights.activePopulation;
  const regionMatchScore = regionScore(world, prefs.preferredRegion) * weights.regionMatch;
  const targetScore = occupancyTargetBonus(ratio) * weights.occupancyTarget;
  const statusPenalty = world.status === 'Online' ? 0 : weights.statusPenalty;

  let total = freeCapacityScore + activePopulationScore + regionMatchScore + targetScore - statusPenalty;

  if (ratio >= 1) {
    total -= 25;
  }

  if (prefs.minCapacity && world.capacity < prefs.minCapacity) {
    total -= 15;
  }

  return {
    total: round(total),
    breakdown: {
      freeCapacityScore: round(freeCapacityScore),
      activePopulationScore: round(activePopulationScore),
      regionMatchScore: round(regionMatchScore),
      targetScore: round(targetScore),
      statusPenalty: round(statusPenalty)
    },
    ratio: round(ratio, 4)
  };
}

function round(n, places = 2) {
  const p = Math.pow(10, places);
  return Math.round(n * p) / p;
}

export function sortAndScoreServers(worlds, prefs, weights) {
  return [...worlds]
    .map((world) => ({
      ...world,
      score: scoreServer(world, prefs, weights)
    }))
    .sort((a, b) => b.score.total - a.score.total || a.name.localeCompare(b.name));
}
