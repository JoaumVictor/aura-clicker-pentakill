// src/components/UpgradeShop.tsx
import React from "react";
import { allUpgrades, Upgrade } from "../../data/UpgradesData";
import { getUpgradeEffect } from "../../game/UpgradeLogic";
import { useAuraActions, useAuraState } from "../../context/AuraContext";
import * as Tooltip from "@radix-ui/react-tooltip";
import UpgradeItem from "../fragments/UpgradeItem";

const UpgradeShop: React.FC = () => {
  const gameState = useAuraState();
  const actions = useAuraActions();

  const handleBuy = (upgrade: Upgrade) => {
    const currentCount = gameState.upgradeCounts[upgrade.id] || 0;
    const cost = Math.ceil(
      upgrade.baseCost * Math.pow(upgrade.costMultiplier, currentCount)
    );
    const effect = getUpgradeEffect(upgrade);
    actions.buyUpgrade(upgrade.id, cost, effect);
  };

  const highestOwnedIndex = allUpgrades.reduce(
    (maxIndex, upgrade, currentIndex) => {
      if ((gameState.upgradeCounts[upgrade.id] || 0) > 0) {
        return currentIndex;
      }
      return maxIndex;
    },
    -1
  );
  const itemsToShowCount = Math.max(2, highestOwnedIndex + 2);
  const visibleUpgrades = allUpgrades.slice(0, itemsToShowCount);

  return (
    <Tooltip.Provider delayDuration={200}>
      <div className="w-full flex items-center justify-center">
        <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-blue-800 scrollbar-track-transparent">
          <div className="flex items-center justify-center gap-4 max-w-7xl flex-wrap">
            {visibleUpgrades.map((upgrade) => (
              <UpgradeItem
                key={upgrade.id}
                upgrade={upgrade}
                gameState={gameState}
                handleBuy={handleBuy}
              />
            ))}
          </div>
        </div>
      </div>
    </Tooltip.Provider>
  );
};

export default UpgradeShop;
