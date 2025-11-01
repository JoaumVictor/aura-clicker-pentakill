// src/components/ImprovementShop.tsx
import React from "react";
import { HelpCircle, icons, LucideIcon as LucideIconType } from "lucide-react";
// 💡 1. Importa o Radix UI Tooltip
import * as Tooltip from "@radix-ui/react-tooltip";
import CountUp from "react-countup";
import { allImprovements, Improvement } from "@/data/ImprovementsData";
import { formatNumber } from "@/utils/formatters";
import { useAuraActions, useAuraState } from "@/context/AuraContext";

// Helper para renderizar o ícone dinâmico (sem mudanças)
const DynamicIcon = ({
  name,
  ...props
}: { name: string } & React.ComponentProps<LucideIconType>) => {
  const LucideIcon = icons[name as keyof typeof icons];

  if (!LucideIcon) {
    return <HelpCircle {...props} />; // Ícone padrão
  }
  return <LucideIcon {...props} />;
};

/**
 * Renderiza um único item de Melhoria (agora com Tooltip)
 */
const ImprovementItem: React.FC<{
  improvement: Improvement;
  canAfford: boolean;
  handleBuy: (imp: Improvement) => void;
}> = ({ improvement, canAfford, handleBuy }) => {
  return (
    // 💡 2. Cada item agora é um Tooltip
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <div
          // Removemos o 'title'
          className={`
            w-14 h-14 m-1 rounded-lg transition-all
            flex items-center justify-center
            border border-white/10 cursor-pointer
            ${
              canAfford
                ? "bg-black/30 backdrop-blur-md text-yellow-300 hover:bg-black/50 hover:border-yellow-300/50"
                : "bg-black/50 backdrop-blur-sm text-gray-600 border-gray-700/50 "
            }
          `}
          onClick={() => canAfford && handleBuy(improvement)}
          onDragStart={(e) => e.preventDefault()}
        >
          <DynamicIcon name={improvement.iconName} size={28} />
        </div>
      </Tooltip.Trigger>

      {/* 💡 3. Portal e Conteúdo do Tooltip */}
      <Tooltip.Portal>
        <Tooltip.Content
          sideOffset={5}
          className="z-50 p-3 rounded-lg max-w-xs bg-gray-900/70 backdrop-blur-lg  border border-white/10 text-white shadow-lg"
        >
          <p className="text-xl text-yellow-300">{improvement.name}</p>
          <p className="text-xl text-gray-200 mt-1">
            {improvement.description}
          </p>
          <p className="text-xl text-yellow-400 mt-2">
            Custo:{" "}
            <CountUp
              end={improvement.cost}
              formattingFn={formatNumber}
              preserveValue
              duration={0.5}
            />{" "}
            Aura
          </p>
          <Tooltip.Arrow className="fill-gray-900/70" />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
};

const ImprovementShop: React.FC = () => {
  const gameState = useAuraState();
  const actions = useAuraActions();

  const availableImprovements = allImprovements.filter((imp) =>
    imp.isVisible(gameState)
  );

  if (availableImprovements.length === 0) {
    return null;
  }

  const handleBuy = (improvement: Improvement) => {
    actions.buyImprovement(improvement.id, improvement.cost);
  };

  return (
    // 💡 4. Provider do Tooltip e Fundo 100% Transparente
    // Removemos bg-black/20, backdrop-blur-sm, e border-b
    <Tooltip.Provider delayDuration={200}>
      <div className="w-full p-2" onDragStart={(e) => e.preventDefault()}>
        <div className="flex flex-wrap justify-center">
          {availableImprovements.map((imp) => (
            <ImprovementItem
              key={imp.id}
              improvement={imp}
              canAfford={gameState.auraTotal >= imp.cost}
              handleBuy={handleBuy}
            />
          ))}
        </div>
      </div>
    </Tooltip.Provider>
  );
};

export default ImprovementShop;
