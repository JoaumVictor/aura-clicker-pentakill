import { AuraState, AuraStateCalculated } from "../context/AuraContext";
import { allImprovements, Improvement } from "../data/ImprovementsData";
import { allUpgrades } from "../data/UpgradesData";

const getPurchasedImprovements = (
  state: AuraState | AuraStateCalculated
): Improvement[] => {
  return allImprovements.filter((imp) =>
    state.purchasedImprovements.includes(imp.id)
  );
};

const getTotalNonFocoUpgrades = (
  state: AuraState | AuraStateCalculated
): number => {
  let count = 0;
  for (const upgradeId in state.upgradeCounts) {
    if (upgradeId !== "foco-ativo") {
      count += state.upgradeCounts[upgradeId] || 0;
    }
  }
  return count;
};

export const calculateTotalClickPower = (
  state: AuraState | AuraStateCalculated,
  totalCPS: number // Recebe o CPS Total como argumento
): number => {
  const purchased = getPurchasedImprovements(state);

  // 1. Calcula o Bônus Base (Base 1 * multiplicadores)
  let baseClickPower = 1;
  // 2. Calcula o Bônus de Porcentagem (soma 1% + 1% + 3%...)
  let cpsBonusPercentage = 0;

  for (const imp of purchased) {
    for (const effect of imp.effects) {
      switch (effect.type) {
        case "global_click_mult":
          baseClickPower *= effect.multiplier;
          break;
        case "global_click_cps_bonus":
          cpsBonusPercentage += effect.bonusPercentage;
          break;
      }
    }
  }

  // 3. Calcula o bônus final
  const cpsClickBonus = totalCPS * cpsBonusPercentage;

  // Retorna a soma dos dois
  return baseClickPower + cpsClickBonus;
};

const calculateCPSForSingleUpgrade = (
  upgradeId: string,
  state: AuraState | AuraStateCalculated,
  purchased: Improvement[]
): number => {
  const count = state.upgradeCounts[upgradeId] || 0;
  if (count === 0) return 0;

  const upgradeData = allUpgrades.find((u) => u.id === upgradeId);
  if (!upgradeData) return 0;

  const cpsBase = upgradeData.baseEffect;
  let directMultiplier = 1;
  let synergyFocoBonus = 0;
  let synergyFocoMultiplier = 1;
  let crossSynergyBonus = 0;

  for (const imp of purchased) {
    for (const effect of imp.effects) {
      switch (effect.type) {
        case "upgrade_mult":
          if (effect.targetUpgradeId === upgradeId) {
            directMultiplier *= effect.multiplier;
          }
          break;

        case "synergy_foco":
          if (upgradeId === "foco-ativo") {
            synergyFocoBonus += effect.baseBonus;
            synergyFocoMultiplier *= effect.multiplier;
          }
          break;

        case "synergy_cross":
          if (effect.targetUpgradeId === upgradeId) {
            const sourceCount =
              state.upgradeCounts[effect.sourceUpgradeId] || 0;
            crossSynergyBonus += sourceCount * effect.bonusPerSource;
          }
          break;
      }
    }
  }

  const baseCpsForThisType = cpsBase * count;
  const directBuffedCPS = baseCpsForThisType * directMultiplier;
  const crossBuffedCPS = baseCpsForThisType * (1 + crossSynergyBonus);

  let synergyFocoCPS = 0;
  if (upgradeId === "foco-ativo") {
    const nonFocoCount = getTotalNonFocoUpgrades(state);
    synergyFocoCPS = nonFocoCount * synergyFocoBonus * synergyFocoMultiplier;
  }

  if (upgradeId === "foco-ativo") {
    return directBuffedCPS + synergyFocoCPS;
  } else {
    return crossBuffedCPS * directMultiplier;
  }
};

export const calculateTotalCPS = (
  state: AuraState | AuraStateCalculated
): number => {
  const purchased = getPurchasedImprovements(state);
  let totalCPS = 0;

  for (const upgradeId in state.upgradeCounts) {
    totalCPS += calculateCPSForSingleUpgrade(upgradeId, state, purchased);
  }
  return totalCPS;
};

export const calculateTotalCPSForUpgrade = (
  state: AuraStateCalculated,
  upgradeId: string
): number => {
  const purchased = getPurchasedImprovements(state);
  return calculateCPSForSingleUpgrade(upgradeId, state, purchased);
};

export const calculateAuraGeneratedByUpgrade = (
  state: AuraStateCalculated,
  upgradeId: string
): number => {
  const baseAuraGenerated = state.auraGeneratedByUpgrade[upgradeId] || 0;
  if (baseAuraGenerated === 0) return 0;

  const upgradeData = allUpgrades.find((u) => u.id === upgradeId);
  if (!upgradeData) return 0;

  const totalBuffedCPS = calculateTotalCPSForUpgrade(state, upgradeId);
  const baseCPS =
    (state.upgradeCounts[upgradeId] || 0) * upgradeData.baseEffect;

  if (baseCPS === 0) return 0;

  const effectiveMultiplier = totalBuffedCPS / baseCPS;

  return baseAuraGenerated * effectiveMultiplier;
};

export const calculateBaseCPS = (
  state: AuraState | AuraStateCalculated
): number => {
  let baseCPS = 0;
  for (const upgradeId in state.upgradeCounts) {
    const count = state.upgradeCounts[upgradeId];
    if (count === 0) continue;
    const upgradeData = allUpgrades.find((u) => u.id === upgradeId);
    if (!upgradeData) continue;
    baseCPS += upgradeData.baseEffect * count;
  }
  return baseCPS;
};
