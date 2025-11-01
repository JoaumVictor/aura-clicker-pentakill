import { AuraActions, AuraStateCalculated } from "@/context/AuraContext";
import { allUpgrades } from "@/data/UpgradesData";

interface StageRequirements {
  stage: number;
  auraTotal?: number;
  baseCps?: number;
  upgrades?: Record<string, number>;
  improvements?: string[];
  totalUpgrades?: number;
  allUpgradesMin?: number;
}

const stageRequirements: StageRequirements[] = [
  {
    stage: 2,
    baseCps: 10.0,
  },
  {
    stage: 3,
    auraTotal: 10_000,
    improvements: ["meditacao-1"],
  },
  {
    stage: 4,
    baseCps: 100,
    upgrades: { "campo-de-aura": 1 },
  },
  {
    stage: 5,
    baseCps: 1_000,
    upgrades: { "mina-de-cristal": 1 },
  },
  {
    stage: 6,
    auraTotal: 50_000_000,
    totalUpgrades: 100,
  },
  {
    stage: 7,
    baseCps: 50_000,
    improvements: ["foco-sinergia-1"],
  },
  {
    stage: 8,
    auraTotal: 1_000_000_000,
    upgrades: { "forja-eterea": 10 },
  },
  {
    stage: 9,
    totalUpgrades: 500,
    upgrades: { "banco-astral": 1 },
  },
  {
    stage: 10,
    baseCps: 1_000_000,
    improvements: ["sinergia-meditacao-campo"],
  },
  {
    stage: 11,
    auraTotal: 1_000_000_000_000,
    upgrades: { "templo-da-consciencia": 1 },
  },
  {
    stage: 12,
    baseCps: 100_000_000,
    allUpgradesMin: 50,
  },
  {
    stage: 13,
    totalUpgrades: 1000,
    upgrades: { "torre-do-arcanjo": 10 },
  },
  {
    stage: 14,
    baseCps: 10_000_000_000,
    improvements: ["foco-sinergia-4", "sinergia-campo-templo"],
  },
  {
    stage: 15,
    auraTotal: 1_000_000_000_000_000,
    allUpgradesMin: 100,
  },
];

const checkRequirements = (
  state: AuraStateCalculated,
  reqs: StageRequirements
): boolean => {
  if (reqs.auraTotal && state.auraTotal < reqs.auraTotal) {
    return false;
  }
  if (reqs.baseCps && state.baseCps < reqs.baseCps) {
    return false;
  }
  if (reqs.improvements) {
    const hasAllImprovements = reqs.improvements.every((id) =>
      state.purchasedImprovements.includes(id)
    );
    if (!hasAllImprovements) return false;
  }
  if (reqs.upgrades) {
    for (const id in reqs.upgrades) {
      if ((state.upgradeCounts[id] || 0) < reqs.upgrades[id]) {
        return false;
      }
    }
  }
  if (reqs.totalUpgrades) {
    const total = Object.values(state.upgradeCounts).reduce(
      (sum, count) => sum + count,
      0
    );
    if (total < reqs.totalUpgrades) return false;
  }
  if (reqs.allUpgradesMin) {
    const hasMinUpgrades = allUpgrades.every(
      (upgrade) =>
        (state.upgradeCounts[upgrade.id] || 0) >= reqs.allUpgradesMin!
    );
    if (!hasMinUpgrades) return false;
  }

  return true;
};

export const runGameProgress = (
  state: AuraStateCalculated,
  actions: AuraActions
): void => {
  let currentStage = state.stage;
  let hasProgressed = false;

  while (true) {
    const nextStageData = stageRequirements.find(
      (req) => req.stage === currentStage + 1
    );

    if (!nextStageData) {
      break;
    }

    const passed = checkRequirements(state, nextStageData);

    if (passed) {
      currentStage++;
      hasProgressed = true;
    } else {
      break;
    }
  }

  if (hasProgressed) {
    console.log(`Progressor: Avançou para o Estágio ${currentStage}`);
    actions.setStage(currentStage);
  }
};
