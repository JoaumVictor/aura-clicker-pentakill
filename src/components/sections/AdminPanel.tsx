import { useAuraActions, useAuraState } from "@/context/AuraContext";
import { allUpgrades } from "@/data/UpgradesData";
import { getUpgradeEffect } from "@/game/UpgradeLogic";
import useSpriteManager from "@/hooks/use-sprite-manager";
import React, { useState } from "react";

const AdminPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const actions = useAuraActions();
  const gameState = useAuraState();

  const { currentSpriteIndex } = useSpriteManager(gameState);

  const handleAddAura = (amount: number) => {
    const newState = {
      ...gameState,
      auraTotal: gameState.auraTotal + amount,
    };
    actions.resetAndSetState(newState);
  };

  const handleAddUpgrades = (upgradeId: string, amount: number) => {
    const upgradeData = allUpgrades.find((u) => u.id === upgradeId);
    if (!upgradeData) {
      console.error("ID de upgrade não encontrado no Admin:", upgradeId);
      return;
    }
    const effect = getUpgradeEffect(upgradeData);
    for (let i = 0; i < amount; i++) {
      actions.buyUpgrade(upgradeId, 0, effect);
    }
  };

  const handleWipeSave = () => {
    actions.wipeSave();
  };

  if (!isOpen) {
    return (
      <button
        className="fixed bottom-4 right-4 z-50 bg-red-600 text-white p-2 rounded-lg shadow-lg hover:bg-red-700"
        onClick={() => setIsOpen(true)}
      >
        Admin
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-gray-800 border border-red-500 p-4 rounded-lg shadow-2xl flex flex-col gap-3 w-64">
      <div className="flex justify-between items-center">
        <h3 className="text-lg text-red-400">Painel de Admin</h3>
        <button
          className="text-gray-400 hover:text-white"
          onClick={() => setIsOpen(false)}
        >
          Fechar [X]
        </button>
      </div>

      <div className="text-left p-2 bg-gray-900 rounded">
        <p className="text-base text-purple-400">
          ESTÁGIO ATUAL: {gameState.stage}
        </p>
        <p className="text-sm text-gray-400 mt-1">
          Sprite Atual: {currentSpriteIndex + 1} / 65
        </p>
      </div>

      <hr className="border-gray-600" />

      <button
        className="w-full p-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
        onClick={() => handleAddAura(100_000)}
      >
        +1,000 Aura
      </button>
      <button
        className="w-full p-2 bg-purple-600 hover:bg-purple-700 rounded text-white"
        onClick={() => handleAddUpgrades("foco-ativo", 10)}
      >
        +10 Foco Ativo
      </button>
      <button
        className="w-full p-2 bg-green-600 hover:bg-green-700 rounded text-white"
        onClick={() => handleAddUpgrades("meditacao", 10)}
      >
        +10 Meditação
      </button>
      <button
        className="w-full p-2 bg-yellow-600 hover:bg-yellow-700 rounded text-white"
        onClick={() => handleAddUpgrades("campo-de-aura", 10)}
      >
        +10 Campo de Aura
      </button>

      <hr className="border-gray-600" />

      <button
        className="w-full p-2 bg-red-800 hover:bg-red-700 rounded text-white"
        onClick={handleWipeSave}
      >
        LIMPAR SAVE
      </button>
    </div>
  );
};

export default AdminPanel;
