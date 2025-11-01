// src/hooks/use-aura-sprite-manager.ts
// Hook que gerencia a lógica de mapeamento do estado do jogo (Aura/CPS) para o índice de sprite.

import { useState, useEffect, useRef } from "react";
import { AuraState } from "../context/AuraContext";
// Importa a interface que criamos

// --- Constantes de Controle do Jogo ---
const TOTAL_SPRITES = 65;
const MAX_BASE_SPRITE = 60;

// Marcos de Sprite (Index de 0 a 64) baseados na descrição do Victor:
const START_PHASE_CPS_DEPENDENT = 4; // Sprite 5 (index 4) é o limite da fase de cliques.
const START_PHASE_FOGO_OU_CHAMA = 8; // Sprite 9: Fogo baixo começa (index 8)
const START_PHASE_INSTABILIDADE = 46; // Sprite 47: Raios e aura aumentando (instabilidade elétrica)
const START_PHASE_NEGRA = 60; // Sprite 61: Energia negra começa a tomar conta

// Limites do Jogo para Mapeamento
const MAX_CPS_TO_MAP = 1000000; // 1 Milhão de CPS mapeia até a fase de Instabilidade (Sprite 47)
const MIN_AURA_FOR_DARK_PHASE = 1e12; // 1 Trilhao de Aura inicia a fase negra (Sprite 61)
const MAX_AURA_FOR_DARK_PHASE = 1e14; // 100 Trilhoes de Aura atinge o Sprite 65

// Controle de Instabilidade
const INSTABILITY_THRESHOLD_INDEX = 45; // Quando atinge o Sprite 46, a instabilidade começa
const INSTABILITY_AMPLITUDE_MAX = 10; // O quanto o sprite pode 'pular' (ex: +/- 10)

// --- Lógica de Mapeamento da Força ---
const calculateBaseSpriteIndex = (
  aura: number,
  cps: number,
  clicks: number
): number => {
  // 1. FASE INICIAL: Dependente SOMENTE de cliques (Sprites 1 a 5 - Index 0 a 4)
  // O sprite deve se mover com os cliques APENAS se o CPS for zero.
  if (clicks <= START_PHASE_CPS_DEPENDENT && cps < 1) {
    // 0 cliques -> Sprite 1 (index 0)
    // 4 cliques -> Sprite 5 (index 4)
    return clicks;
  }

  // Se o CPS for 0 e os cliques passarem de 5, mantemos no Sprite 5, esperando o CPS.
  if (cps < 1) {
    return START_PHASE_CPS_DEPENDENT; // Fica no Sprite 5 (index 4) até ganhar 1 CPS.
  }

  // 2. Transição de Fogo/Aura/Raios (Sprites 9 a 46 - Index 8 a 45)
  // Se o CPS for >= 1, a Aura começa a progredir rapidamente.

  let baseIndex = START_PHASE_FOGO_OU_CHAMA; // Padrão: Sprite 9 (index 8)

  // Mapeamento Logarítmico do CPS para o range de Sprites 8 a 45
  const powerRange = START_PHASE_INSTABILIDADE - START_PHASE_FOGO_OU_CHAMA; // 46 - 8 = 38 sprites

  // O logaritmo é ótimo para mapear um grande range de valores (CPS) para um pequeno range de sprites.
  const logCps = Math.log10(Math.max(cps, 1)); // Usa max(cps, 1) para evitar log(0)
  const maxLogCps = Math.log10(MAX_CPS_TO_MAP + 1);

  if (logCps < maxLogCps) {
    const progressRatio = logCps / maxLogCps;
    const mappedIndex = Math.floor(progressRatio * powerRange);

    // Garante que a progressão só comece a partir do Sprite 9 (index 8)
    baseIndex = START_PHASE_FOGO_OU_CHAMA + mappedIndex;
  } else {
    // Se o CPS ultrapassar o limite (1M), força o início da Instabilidade
    baseIndex = START_PHASE_INSTABILIDADE;
  }

  // 3. Fase da Escuridão Explosiva (Sprites 61 a 65 - Index 60 a 64)
  // Mapeamos a Aura Total (muito alta)
  if (aura >= MIN_AURA_FOR_DARK_PHASE) {
    const aurasToMap = MAX_AURA_FOR_DARK_PHASE - MIN_AURA_FOR_DARK_PHASE;
    const currentAuraProgress = Math.min(
      aura - MIN_AURA_FOR_DARK_PHASE,
      aurasToMap
    );

    const darkSpriteRange = TOTAL_SPRITES - START_PHASE_NEGRA; // 65 - 61 = 4 sprites
    const darkIndexOffset = Math.floor(
      (currentAuraProgress / aurasToMap) * darkSpriteRange
    );

    baseIndex = START_PHASE_NEGRA + darkIndexOffset;
  }

  // Garante que o índice não saia dos limites
  return Math.max(0, Math.min(baseIndex, TOTAL_SPRITES - 1));
};

// --- O Hook Principal ---
const useSpriteManager = (auraState: AuraState) => {
  const [currentSpriteIndex, setCurrentSpriteIndex] = useState(0);
  const frameRef = useRef<number>();

  // O LOOP RÁPIDO para a troca de frames (Sincronizado com a tela)
  useEffect(() => {
    const animate = (time: DOMHighResTimeStamp) => {
      const { auraTotal, cps, clicks } = auraState;

      // 1. Calcula o Sprite Base
      const baseIndex = calculateBaseSpriteIndex(auraTotal, cps, clicks);
      let newIndex = baseIndex;

      // 2. Lógica de INSTABILIDADE (Flicker)
      const isInstable = baseIndex >= INSTABILITY_THRESHOLD_INDEX;
      const isBlackHolePhase = baseIndex >= START_PHASE_NEGRA;

      if (isInstable) {
        // A amplitude do flicker é maior na fase de instabilidade/negra
        const instabilityLevel = isBlackHolePhase
          ? INSTABILITY_AMPLITUDE_MAX * 1.5
          : INSTABILITY_AMPLITUDE_MAX;

        // Gera um 'offset' aleatório (pulo brusco de sprite)
        const offset =
          Math.floor(Math.random() * (instabilityLevel * 2 + 1)) -
          instabilityLevel;

        newIndex = baseIndex + offset;
        newIndex = Math.max(0, Math.min(newIndex, TOTAL_SPRITES - 1));
      } else if (baseIndex > START_PHASE_CPS_DEPENDENT) {
        // Flicker sutil na fase de fogo/energia
        if (baseIndex >= START_PHASE_FOGO_OU_CHAMA && Math.random() < 0.2) {
          newIndex = baseIndex + (Math.random() > 0.5 ? 1 : -1);
        } else {
          newIndex = baseIndex;
        }
      }

      setCurrentSpriteIndex(newIndex);

      frameRef.current = requestAnimationFrame(animate);
    };

    // Inicia a animação
    frameRef.current = requestAnimationFrame(animate);

    // Cleanup: Para o loop quando o componente for desmontado
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [auraState.auraTotal, auraState.cps, auraState.clicks]);

  return { currentSpriteIndex };
};

export default useSpriteManager;
