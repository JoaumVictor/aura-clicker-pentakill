// src/game/UpgradeLogic.ts
import { AuraStateCalculated, UpgradeEffect } from "../context/AuraContext";
import { Upgrade } from "@/data/UpgradesData";

export const calculateCost = (upgrade: Upgrade, count: number): number => {
  return Math.ceil(upgrade.baseCost * Math.pow(upgrade.costMultiplier, count));
};

export const getUpgradeEffect = (upgrade: Upgrade): UpgradeEffect => {
  return {
    id: upgrade.id,
    cpsBoost: upgrade.type === "cps" ? upgrade.baseEffect : 0,
  };
};
