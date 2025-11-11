// src/components/sections/AuraBox.tsx
import React, { useState, useRef } from "react";
import { useAuraActions, useAuraState } from "../../context/AuraContext";
import useSpriteManager from "../../hooks/use-sprite-manager";
import { formatNumber } from "../../utils/formatters";
import CountUp from "react-countup";
import AuraOrb from "../fragments/AuraOrb";

interface FloatingText {
  id: number;
  value: string;
  x: number;
  y: number;
  clickValue: number;
}

const AuraBox: React.FC = () => {
  const gameState = useAuraState();
  const actions = useAuraActions();
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);

  // 💡 2. Criar uma 'ref' para o nosso contêiner principal
  const containerRef = useRef<HTMLDivElement>(null);

  const handleOrbClick = (e: React.MouseEvent) => {
    // 💡 3. A LÓGICA CORRIGIDA
    if (!containerRef.current) return; // Garante que o contêiner existe

    // Pega o retângulo (posição) do nosso contêiner 'relative'
    const rect = containerRef.current.getBoundingClientRect();

    // Calcula o X e Y do clique DENTRO do contêiner
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // O resto da lógica é 100% igual
    const actualClickValue = gameState.clickPower;
    actions.addAuraOnClick(actualClickValue);

    const newText: FloatingText = {
      id: Date.now() + Math.random(),
      value: `+${actualClickValue.toLocaleString("pt-BR")}`,
      x: x, // <-- Usa o X relativo
      y: y, // <-- Usa o Y relativo
      clickValue: actualClickValue,
    };

    setFloatingTexts((prev) => [...prev, newText]);

    setTimeout(() => {
      setFloatingTexts((prev) => prev.filter((t) => t.id !== newText.id));
    }, 900);
  };

  const { currentSpriteIndex } = useSpriteManager(gameState);

  return (
    // 💡 4. Anexa a 'ref' ao contêiner principal
    <div ref={containerRef} className="flex flex-col items-center p-4 relative">
      {/* Conteúdo central (Orbe e Stats) - Sem Mudanças */}
      <div className="flex flex-col items-center justify-center">
        <AuraOrb
          currentSpriteIndex={currentSpriteIndex}
          onOrbClick={handleOrbClick}
        />

        <div className="mt-6 text-center text-white">
          <p className="text-yellow-400">
            <span className="text-4xl">
              <CountUp
                end={gameState.auraTotal}
                formattingFn={formatNumber}
                preserveValue
                duration={0.5}
              />
            </span>
            <span className="text-xl ml-2">auras</span>
          </p>
          <p className="text-lg text-green-400 mt-1">
            por segundo:{" "}
            <CountUp
              end={gameState.cps}
              formattingFn={formatNumber}
              preserveValue
              duration={0.5}
              decimals={1}
            />
          </p>
        </div>
      </div>

      {/* Mapeamento do Floating Text (sem mudanças) */}
      {floatingTexts.map((text) => (
        <div
          key={text.id}
          className={`absolute z-50 pointer-events-none opacity-0 text-3xl text-yellow-500`}
          style={{
            left: text.x, // <-- A mágica acontece aqui
            top: text.y, // <-- A mágica acontece aqui
            animation: "floatUp 0.8s ease-out forwards",
          }}
        >
          {text.value}
        </div>
      ))}
    </div>
  );
};

export default AuraBox;
