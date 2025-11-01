export interface Upgrade {
  id: string;
  name: string;
  description: string;
  type: "cps";
  baseCost: number;
  baseEffect: number;
  costMultiplier: number;
  stageMin: number;
  iconName: string; // 💡 NOVO CAMPO
}

export const allUpgrades: Upgrade[] = [
  {
    id: "foco-ativo",
    name: "Foco Ativo",
    description: "Gera um fluxo passivo de Aura (+0.1 CPS).",
    type: "cps",
    baseCost: 15,
    baseEffect: 0.1,
    costMultiplier: 1.15,
    stageMin: 1,
    iconName: "MousePointer2", // 💡
  },
  {
    id: "meditacao",
    name: "Meditação",
    description: "Uma meditação mais profunda gera 1 Aura/s.",
    type: "cps",
    baseCost: 100,
    baseEffect: 1,
    costMultiplier: 1.15,
    stageMin: 1,
    iconName: "BrainCircuit", // 💡
  },
  {
    id: "campo-de-aura",
    name: "Campo de Aura",
    description: "Cultiva Aura diretamente do ambiente (+8 CPS).",
    type: "cps",
    baseCost: 1100,
    baseEffect: 8,
    costMultiplier: 1.15,
    stageMin: 1,
    iconName: "Sprout", // 💡
  },
  {
    id: "mina-de-cristal",
    name: "Mina de Cristal",
    description: "Escava cristais imbuídos em Aura pura (+47 CPS).",
    type: "cps",
    baseCost: 12000,
    baseEffect: 47,
    costMultiplier: 1.15,
    stageMin: 1,
    iconName: "Gem", // 💡
  },
  {
    id: "forja-eterea",
    name: "Forja Etérea",
    description: "Transmuta matéria bruta em Aura manifesta (+260 CPS).",
    type: "cps",
    baseCost: 130000,
    baseEffect: 260,
    costMultiplier: 1.15,
    stageMin: 1,
    iconName: "Flame", // 💡
  },
  {
    id: "banco-astral",
    name: "Banco Astral",
    description:
      "Investe sua Aura em planos superiores, gerando juros (+1.4k CPS).",
    type: "cps",
    baseCost: 1400000,
    baseEffect: 1400,
    costMultiplier: 1.15,
    stageMin: 1,
    iconName: "Landmark", // 💡
  },
  {
    id: "templo-da-consciencia",
    name: "Templo da Consciência",
    description: "Um local de poder que atrai Aura cósmica (+7.8k CPS).",
    type: "cps",
    baseCost: 20000000,
    baseEffect: 7800,
    costMultiplier: 1.15,
    stageMin: 1,
    iconName: "Brain", // 💡
  },
  {
    id: "torre-do-arcanjo",
    name: "Torre do Arcanjo",
    description: "Canaliza energia pura dos céus (+44k CPS).",
    type: "cps",
    baseCost: 330000000,
    baseEffect: 44000,
    costMultiplier: 1.15,
    stageMin: 1,
    iconName: "TowerControl", // 💡
  },
];
