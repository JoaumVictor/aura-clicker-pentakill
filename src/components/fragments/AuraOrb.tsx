import { useAuraState } from "@/context/AuraContext";
import AuraSprites from "@/utils/auraSprites";
import React, { useState, useEffect } from "react";

interface AuraOrbProps {
  currentSpriteIndex: number;
  onOrbClick: (e: React.MouseEvent) => void;
}

const calculateFlickerSpeed = (cps: number): number | null => {
  if (cps < 10) {
    return null;
  }
  if (cps >= 1000) {
    return 300;
  }
  return 700;
};

const AuraOrb: React.FC<AuraOrbProps> = ({
  currentSpriteIndex,
  onOrbClick,
}) => {
  const [isClicked, setIsClicked] = useState(false);
  const [flickerFrame, setFlickerFrame] = useState(0);
  const gameState = useAuraState();

  useEffect(() => {
    const flickerSpeed = calculateFlickerSpeed(gameState.cps);

    if (flickerSpeed === null) {
      setFlickerFrame(0);
      return;
    }

    const animationInterval = setInterval(() => {
      setFlickerFrame((prevFrame) => (prevFrame + 1) % 3);
    }, flickerSpeed);

    return () => {
      clearInterval(animationInterval);
    };
  }, [gameState.cps]);

  const baseIndex = currentSpriteIndex;
  const finalIndex = Math.min(64, baseIndex + flickerFrame);
  const spriteNumber = finalIndex + 1;
  const spritePath = AuraSprites[spriteNumber];

  if (!spritePath) {
    console.error(`Sprite ${spriteNumber} não encontrado.`);
    return null;
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsClicked(true);
    onOrbClick(e);

    setTimeout(() => {
      setIsClicked(false);
    }, 100);
  };

  const clickAnimationClass = isClicked ? "scale-[0.98]" : "hover:scale-[1.02]";

  const baseClasses =
    "w-64 h-64 mx-auto transition-transform duration-100 ease-out cursor-pointer";

  return (
    <div
      className={`${baseClasses} ${clickAnimationClass}`}
      onMouseDown={handleMouseDown}
    >
      <img
        src={spritePath}
        alt={`Aura Orb Stage ${spriteNumber}`}
        className="transition-none w-full h-full object-contain"
        style={{
          imageRendering: "pixelated",
          userSelect: "none",
        }}
        onDragStart={(e) => e.preventDefault()}
      />
    </div>
  );
};

export default AuraOrb;
