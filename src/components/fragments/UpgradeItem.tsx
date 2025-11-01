// src/components/UpgradeItem.tsx
import React from "react";
import { HelpCircle, icons, LucideIcon as LucideIconType } from "lucide-react";
import * as Tooltip from "@radix-ui/react-tooltip";
import CountUp from "react-countup";
import { calculateCost } from "@/game/UpgradeLogic";
import {
  calculateAuraGeneratedByUpgrade,
  calculateTotalCPSForUpgrade,
} from "@/game/ImprovementLogic";
import { formatNumber } from "@/utils/formatters";

// Helper do Ícone (Copiei do ImprovementShop)
const DynamicIcon = ({
  name,
  ...props
}: { name: string } & React.ComponentProps<LucideIconType>) => {
  const LucideIcon = icons[name as keyof typeof icons];
  if (!LucideIcon) {
    return <HelpCircle {...props} />;
  }
  return <LucideIcon {...props} />;
};

export const UpgradeItem = ({ upgrade, gameState, handleBuy }) => {
  // --- 1. Cálculos (Lógica não muda) ---
  const currentCount = gameState.upgradeCounts[upgrade.id] || 0;
  const currentCost = calculateCost(upgrade, currentCount);
  const canAfford = gameState.auraTotal >= currentCost;

  // --- 2. 💡 NOVOS Cálculos para o Tooltip ---
  const generatedAmount = calculateAuraGeneratedByUpgrade(
    gameState,
    upgrade.id
  );
  const totalCpsForThisUpgrade = calculateTotalCPSForUpgrade(
    gameState,
    upgrade.id
  );
  const totalGlobalCps = gameState.cps;
  const percentageOfTotalCps =
    totalGlobalCps > 0 ? (totalCpsForThisUpgrade / totalGlobalCps) * 100 : 0;

  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <div
          key={upgrade.id}
          className={`
            p-2 rounded-lg transition-all 
            border border-white/10 
            flex items-center justify-between gap-3 cursor-pointer min-w-[200px]
            ${
              canAfford
                ? "bg-gray-900/50 backdrop-blur-md hover:bg-gray-900/70"
                : "bg-black/50 backdrop-blur-sm opacity-60 "
            }
          `}
          onClick={() => canAfford && handleBuy(upgrade)}
        >
          {/* Lado Direito: Custo */}
          <div className="flex items-center gap-2">
            <DynamicIcon
              name={upgrade.iconName}
              size={28}
              className={canAfford ? "text-blue-300" : "text-gray-600"}
            />
            <div>
              <p className="text-white text-md">{upgrade.name}</p>
              <p className="text-yellow-300">
                <CountUp
                  end={currentCost}
                  formattingFn={formatNumber}
                  preserveValue
                  duration={0.5}
                />
              </p>
            </div>
          </div>

          {/* Lado Esquerdo: Ícone e Nome/Contagem */}
          <div className="text-right">
            <p className="text-gray-300 text-3xl">{currentCount}</p>
          </div>
        </div>
      </Tooltip.Trigger>

      {/* 💡 4. O TOOLTIP DETALHADO */}
      <Tooltip.Portal>
        <Tooltip.Content
          sideOffset={5}
          className="z-50 p-3 rounded-lg max-w-xs bg-gray-900/70 backdrop-blur-lg border border-white/10 text-white shadow-lg text-lg"
        >
          <p className=" text-yellow-300">{upgrade.name}</p>
          <p className=" text-gray-300 italic my-1">"{upgrade.description}"</p>
          <hr className="border-white/10 my-2" />

          <ul className="list-disc list-inside space-y-1">
            <li>
              Cada {upgrade.name} produz{" "}
              <span className="text-green-400">
                {upgrade.baseEffect.toLocaleString("pt-BR")}
              </span>{" "}
              CPS base.
            </li>
            {currentCount > 0 && (
              <>
                <li>
                  {currentCount} {upgrade.name}s estão produzindo{" "}
                  <span className="text-green-400">
                    {totalCpsForThisUpgrade.toLocaleString("pt-BR", {
                      maximumFractionDigits: 1,
                    })}
                  </span>{" "}
                  CPS (
                  <span className="text-blue-300">
                    {percentageOfTotalCps.toLocaleString("pt-BR", {
                      maximumFractionDigits: 1,
                    })}
                    %
                  </span>{" "}
                  do CpS total).
                </li>
                <li>
                  <span className="text-yellow-400">
                    {generatedAmount.toLocaleString("pt-BR", {
                      maximumFractionDigits: 0,
                    })}
                  </span>{" "}
                  Aura produzidos até agora.
                </li>
              </>
            )}
          </ul>
          <Tooltip.Arrow className="fill-gray-900/70" />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
};
export default UpgradeItem;
