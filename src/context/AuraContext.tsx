import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
  useRef, // 1. Importar o useRef
} from "react";
import {
  calculateTotalCPS,
  calculateTotalClickPower,
  calculateBaseCPS,
} from "../game/ImprovementLogic";
import { runGameProgress } from "@/game/GameProgressor";

const SAVE_KEY = "auraClickerSave";

export interface UpgradeEffect {
  id: string;
  cpsBoost: number;
}

interface UpgradeContribution {
  cps: number;
}

export interface AuraState {
  auraTotal: number;
  clicks: number;
  stage: number;
  upgradeCounts: Record<string, number>;
  upgradeContributions: Record<string, UpgradeContribution>;
  auraGeneratedByUpgrade: Record<string, number>;
  purchasedImprovements: string[];
}

export interface AuraActions {
  addAuraOnClick: (amount: number) => void;
  setStage: (stage: number) => void;
  buyUpgrade: (id: string, cost: number, effect: UpgradeEffect) => void;
  buyImprovement: (id: string, cost: number) => void;
  resetAndSetState: (newState: AuraState) => void;
  wipeSave: () => void; // 2. Nova ação para limpar o save
}

export const AuraStateContext = createContext<AuraState | undefined>(undefined);
export const AuraActionsContext = createContext<AuraActions | undefined>(
  undefined
);

const initialAuraState: AuraState = {
  auraTotal: 0,
  clicks: 0,
  stage: 1,
  upgradeCounts: {},
  upgradeContributions: {},
  auraGeneratedByUpgrade: {},
  purchasedImprovements: [],
};

export interface AuraStateCalculated extends AuraState {
  cps: number;
  clickPower: number;
  baseCps: number;
}

const getStateWithCalculations = (state: AuraState): AuraStateCalculated => {
  const baseCps = calculateBaseCPS(state);
  const totalCPS = calculateTotalCPS(state);
  const totalClickPower = calculateTotalClickPower(state, totalCPS);

  return {
    ...state,
    cps: totalCPS,
    clickPower: totalClickPower,
    baseCps: baseCps,
  };
};

interface AuraProviderProps {
  children: ReactNode;
}

export const AuraProvider: React.FC<AuraProviderProps> = ({ children }) => {
  const [gameState, setGameState] = useState(initialAuraState);

  // 3. Ref para o contador de auto-save
  const saveCounterRef = useRef(0);

  // 4. LÓGICA DE LOAD (HYDRATION)
  // Roda UMA VEZ quando o jogo abre
  useEffect(() => {
    try {
      const savedGame = localStorage.getItem(SAVE_KEY);
      if (savedGame) {
        const parsedState = JSON.parse(savedGame);
        // Merge para garantir que não faltem chaves se atualizarmos o estado
        setGameState((prevState) => ({
          ...prevState,
          ...parsedState,
        }));
      }
    } catch (e) {
      console.error("Falha ao carregar o save game:", e);
      localStorage.removeItem(SAVE_KEY); // Limpa save corrompido
    }
  }, []); // Array vazio = roda só no "mount"

  const actions: AuraActions = useMemo(
    () => ({
      addAuraOnClick: (amount) => {
        setGameState((prev) => ({
          ...prev,
          auraTotal: parseFloat((prev.auraTotal + amount).toFixed(2)),
          clicks: prev.clicks + 1,
        }));
      },
      setStage: (newStage) => {
        setGameState((prev) => ({
          ...prev,
          stage: Math.max(prev.stage, newStage),
        }));
      },
      buyUpgrade: (id, cost, effect) => {
        setGameState((prev) => {
          if (prev.auraTotal < cost) return prev;
          const newUpgradeCounts = {
            ...prev.upgradeCounts,
            [id]: (prev.upgradeCounts[id] || 0) + 1,
          };
          const currentContributions = prev.upgradeContributions[id] || {
            cps: 0,
          };
          const newContributions: Record<string, UpgradeContribution> = {
            ...prev.upgradeContributions,
            [id]: {
              cps: currentContributions.cps + effect.cpsBoost,
            },
          };
          const newAuraGenerated = { ...prev.auraGeneratedByUpgrade };
          if (!newAuraGenerated[id]) newAuraGenerated[id] = 0;
          return {
            ...prev,
            auraTotal: parseFloat((prev.auraTotal - cost).toFixed(2)),
            upgradeCounts: newUpgradeCounts,
            upgradeContributions: newContributions,
            auraGeneratedByUpgrade: newAuraGenerated,
          };
        });
      },
      buyImprovement: (id, cost) => {
        setGameState((prev) => {
          if (prev.auraTotal < cost) return prev;
          if (prev.purchasedImprovements.includes(id)) return prev;
          return {
            ...prev,
            auraTotal: parseFloat((prev.auraTotal - cost).toFixed(2)),
            purchasedImprovements: [...prev.purchasedImprovements, id],
          };
        });
      },
      resetAndSetState: (newState) => {
        setGameState(newState);
      },
      // 5. Implementação da nova ação
      wipeSave: () => {
        if (
          window.confirm(
            "Tem certeza que quer LIMPAR seu save? Todo o progresso será perdido."
          )
        ) {
          localStorage.removeItem(SAVE_KEY);
          setGameState(initialAuraState);
        }
      },
    }),
    []
  );

  // 6. LÓGICA DE SAVE (AUTOSAVE)
  useEffect(() => {
    const auraInterval = setInterval(() => {
      setGameState((prev) => {
        const { cps: totalCPS, baseCps } = getStateWithCalculations(prev);
        const auraToAdd = parseFloat(totalCPS.toFixed(2));
        const newAuraGenerated = { ...prev.auraGeneratedByUpgrade };

        if (totalCPS > 0 && baseCps > 0) {
          for (const id in prev.upgradeContributions) {
            const contribution = prev.upgradeContributions[id];
            if (contribution.cps > 0) {
              const contributionRatio =
                (contribution.cps * (prev.upgradeCounts[id] || 0)) / baseCps;
              const generatedThisTick = contributionRatio * auraToAdd;
              newAuraGenerated[id] =
                (newAuraGenerated[id] || 0) + generatedThisTick;
            }
          }
        }

        const newState = {
          ...prev,
          auraTotal: parseFloat((prev.auraTotal + auraToAdd).toFixed(2)),
          auraGeneratedByUpgrade: newAuraGenerated,
        };

        runGameProgress(getStateWithCalculations(newState), actions);

        // Lógica de Autosave (a cada 15 segundos)
        saveCounterRef.current += 1;
        if (saveCounterRef.current >= 15) {
          localStorage.setItem(SAVE_KEY, JSON.stringify(newState));
          saveCounterRef.current = 0;
          console.log("Jogo Salvo!"); // (bom para debug)
        }

        return newState;
      });
    }, 1000);

    return () => clearInterval(auraInterval);
  }, [actions]);

  const calculatedState = getStateWithCalculations(gameState);

  return (
    <AuraActionsContext.Provider value={actions}>
      <AuraStateContext.Provider value={calculatedState}>
        {children}
      </AuraStateContext.Provider>
    </AuraActionsContext.Provider>
  );
};

export const useAuraState = (): AuraStateCalculated => {
  const context = useContext(AuraStateContext) as AuraStateCalculated;
  if (context === undefined) {
    throw new Error("useAuraState deve ser usado dentro de um AuraProvider");
  }
  return context;
};

export const useAuraActions = () => {
  const context = useContext(AuraActionsContext);
  if (context === undefined) {
    throw new Error("useAuraActions deve ser usado dentro de um AuraProvider");
  }
  return context;
};
