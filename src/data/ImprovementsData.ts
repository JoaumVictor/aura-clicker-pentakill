/* eslint-disable @typescript-eslint/no-explicit-any */
import { AuraState } from "../context/AuraContext";

export type ImprovementEffect =
  | {
      type: "global_click_mult";
      multiplier: number;
    }
  | {
      type: "upgrade_mult";
      targetUpgradeId: string;
      multiplier: number;
    }
  | {
      type: "synergy_foco";
      baseBonus: number;
      multiplier: number;
    }
  | {
      type: "synergy_cross";
      targetUpgradeId: string;
      sourceUpgradeId: string;
      bonusPerSource: number;
    }
  | {
      type: "global_click_cps_bonus";
      bonusPercentage: number;
    };

export interface Improvement {
  id: string;
  name: string;
  description: string;
  cost: number;
  iconName: string;
  isVisible: (state) => boolean;
  effects: ImprovementEffect[];
}

const reqUpgrade = (
  id: string,
  upgradeId: string,
  count: number,
  purchased: string[] = []
) => {
  return (state: AuraState) => {
    const hasAll = purchased.every((p) =>
      state.purchasedImprovements.includes(p)
    );
    return (
      (state.upgradeCounts[upgradeId] || 0) >= count &&
      hasAll &&
      !state.purchasedImprovements.includes(id)
    );
  };
};

const reqCps = (id: string, cps: number, purchased: string[] = []) => {
  return (state: AuraState) => {
    const hasAll = purchased.every((p) =>
      state.purchasedImprovements.includes(p)
    );
    return (
      (state as any).cps >= cps &&
      hasAll &&
      !state.purchasedImprovements.includes(id)
    );
  };
};

const reqCost = (base: number, multiplier: number) => base * multiplier;

export const allImprovements: Improvement[] = [
  {
    id: "foco-ativo-1",
    name: "Canalização Dupla",
    description: "Dobra o poder do seu clique e a eficiência do 'Foco Ativo'.",
    cost: reqCost(15, 10),
    iconName: "ChevronUp",
    isVisible: reqUpgrade("foco-ativo-1", "foco-ativo", 1),
    effects: [
      { type: "global_click_mult", multiplier: 2 },
      { type: "upgrade_mult", targetUpgradeId: "foco-ativo", multiplier: 2 },
    ],
  },
  {
    id: "foco-ativo-5",
    name: "Canalização Quádrupla",
    description:
      "Duas mãos, o dobro de farm. O 'Foco Ativo' também fica 2x mais forte.",
    cost: reqCost(15, 50),
    iconName: "ChevronsUp",
    isVisible: reqUpgrade("foco-ativo-5", "foco-ativo", 5, ["foco-ativo-1"]),
    effects: [
      { type: "global_click_mult", multiplier: 2 },
      { type: "upgrade_mult", targetUpgradeId: "foco-ativo", multiplier: 2 },
    ],
  },
  {
    id: "foco-ativo-25",
    name: "Canalização Óctupla",
    description:
      "Sua mente começa a clicar por você. O 'Foco Ativo' dobra de novo.",
    cost: reqCost(15, 1000),
    iconName: "ArrowUpCircle",
    isVisible: reqUpgrade("foco-ativo-25", "foco-ativo", 25, ["foco-ativo-5"]),
    effects: [
      { type: "global_click_mult", multiplier: 2 },
      { type: "upgrade_mult", targetUpgradeId: "foco-ativo", multiplier: 2 },
    ],
  },
  {
    id: "foco-ativo-50",
    name: "Canalização x16",
    description: "O clique é automático. A eficiência do 'Foco Ativo' dobra.",
    cost: reqCost(15, 10000),
    iconName: "Target",
    isVisible: reqUpgrade("foco-ativo-50", "foco-ativo", 50, ["foco-ativo-25"]),
    effects: [
      { type: "global_click_mult", multiplier: 2 },
      { type: "upgrade_mult", targetUpgradeId: "foco-ativo", multiplier: 2 },
    ],
  },
  {
    id: "foco-ativo-100",
    name: "Canalização x32",
    description:
      "Você nem precisa mais pensar. Apenas farmar. Dobra o 'Foco Ativo'.",
    cost: reqCost(15, 100000),
    iconName: "MousePointerClick",
    isVisible: reqUpgrade("foco-ativo-100", "foco-ativo", 100, [
      "foco-ativo-50",
    ]),
    effects: [
      { type: "global_click_mult", multiplier: 2 },
      { type: "upgrade_mult", targetUpgradeId: "foco-ativo", multiplier: 2 },
    ],
  },
  {
    id: "foco-sinergia-1",
    name: "Mente Expandida",
    description:
      "O 'Foco Ativo' ganha +0.1 CPS base para CADA outro gerador que você possui.",
    cost: 100000,
    iconName: "Brain",
    isVisible: reqUpgrade("foco-sinergia-1", "foco-ativo", 25),
    effects: [{ type: "synergy_foco", baseBonus: 0.1, multiplier: 1 }],
  },
  {
    id: "foco-sinergia-2",
    name: "Sinapses de Milhões",
    description:
      "Multiplica o bônus de 'Mente Expandida' por 5. As ideias estão fritando!",
    cost: 10000000,
    iconName: "BrainCircuit",
    isVisible: reqUpgrade("foco-sinergia-2", "foco-ativo", 50, [
      "foco-sinergia-1",
    ]),
    effects: [{ type: "synergy_foco", baseBonus: 0, multiplier: 5 }],
  },
  {
    id: "foco-sinergia-3",
    name: "Cérebro de Galáxia",
    description:
      "Multiplica o bônus de 'Mente Expandida' por 10. Você tá pensando em portais.",
    cost: 100000000,
    iconName: "Orbit",
    isVisible: reqUpgrade("foco-sinergia-3", "foco-ativo", 100, [
      "foco-sinergia-2",
    ]),
    effects: [{ type: "synergy_foco", baseBonus: 0, multiplier: 10 }],
  },
  {
    id: "foco-sinergia-4",
    name: "Onisciência Casual",
    description:
      "Multiplica o bônus de 'Mente Expandida' por 20. Você já entendeu tudo, é só farmar.",
    cost: 1000000000,
    iconName: "Sparkles",
    isVisible: reqUpgrade("foco-sinergia-4", "foco-ativo", 150, [
      "foco-sinergia-3",
    ]),
    effects: [{ type: "synergy_foco", baseBonus: 0, multiplier: 20 }],
  },
  {
    id: "meditacao-1",
    name: "Meditação Profunda",
    description: "Torna a 'Meditação' duas vezes mais eficiente.",
    cost: reqCost(100, 10),
    iconName: "UserPlus",
    isVisible: reqUpgrade("meditacao-1", "meditacao", 1),
    effects: [
      { type: "upgrade_mult", targetUpgradeId: "meditacao", multiplier: 2 },
    ],
  },
  {
    id: "meditacao-5",
    name: "Paciência Ancestral",
    description:
      "Sua paciência é recompensada. Dobra a eficiência da 'Meditação'.",
    cost: reqCost(100, 50),
    iconName: "Users",
    isVisible: reqUpgrade("meditacao-5", "meditacao", 5, ["meditacao-1"]),
    effects: [
      { type: "upgrade_mult", targetUpgradeId: "meditacao", multiplier: 2 },
    ],
  },
  {
    id: "meditacao-25",
    name: "União das Mentes",
    description: "Consciência coletiva. A 'Meditação' dobra de novo.",
    cost: reqCost(100, 1000),
    iconName: "BookOpen",
    isVisible: reqUpgrade("meditacao-25", "meditacao", 25, ["meditacao-5"]),
    effects: [
      { type: "upgrade_mult", targetUpgradeId: "meditacao", multiplier: 2 },
    ],
  },
  {
    id: "meditacao-50",
    name: "Pacto das Matriarcas",
    description: "Controle mental total. A 'Meditação' dobra de eficiência.",
    cost: reqCost(100, 10000),
    iconName: "HeartPulse",
    isVisible: reqUpgrade("meditacao-50", "meditacao", 50, ["meditacao-25"]),
    effects: [
      { type: "upgrade_mult", targetUpgradeId: "meditacao", multiplier: 2 },
    ],
  },
  {
    id: "meditacao-100",
    name: "Consciência Cósmica",
    description: "Você atingiu o Nirvana do farm. Dobra a 'Meditação'.",
    cost: reqCost(100, 100000),
    iconName: "Sparkles",
    isVisible: reqUpgrade("meditacao-100", "meditacao", 100, ["meditacao-50"]),
    effects: [
      { type: "upgrade_mult", targetUpgradeId: "meditacao", multiplier: 2 },
    ],
  },
  {
    id: "campo-de-aura-1",
    name: "Solo Fértil",
    description: "Torna o 'Campo de Aura' duas vezes mais eficiente.",
    cost: reqCost(1100, 10),
    iconName: "Flower",
    isVisible: reqUpgrade("campo-de-aura-1", "campo-de-aura", 1),
    effects: [
      {
        type: "upgrade_mult",
        targetUpgradeId: "campo-de-aura",
        multiplier: 2,
      },
    ],
  },
  {
    id: "campo-de-aura-5",
    name: "Semeadura Áurica",
    description:
      "A terra obedece sua vontade. Dobra a eficiência do 'Campo de Aura'.",
    cost: reqCost(1100, 50),
    iconName: "Flower2",
    isVisible: reqUpgrade("campo-de-aura-5", "campo-de-aura", 5, [
      "campo-de-aura-1",
    ]),
    effects: [
      {
        type: "upgrade_mult",
        targetUpgradeId: "campo-de-aura",
        multiplier: 2,
      },
    ],
  },
  {
    id: "campo-de-aura-25",
    name: "Colheita Abundante",
    description:
      "A colheita é lendária. Dobra a eficiência do 'Campo de Aura'.",
    cost: reqCost(1100, 1000),
    iconName: "Trees",
    isVisible: reqUpgrade("campo-de-aura-25", "campo-de-aura", 25, [
      "campo-de-aura-5",
    ]),
    effects: [
      {
        type: "upgrade_mult",
        targetUpgradeId: "campo-de-aura",
        multiplier: 2,
      },
    ],
  },
  {
    id: "campo-de-aura-50",
    name: "Ciclo Perene",
    description:
      "A própria natureza te dá Aura. Dobra a eficiência do 'Campo de Aura'.",
    cost: reqCost(1100, 10000),
    iconName: "Sun",
    isVisible: reqUpgrade("campo-de-aura-50", "campo-de-aura", 50, [
      "campo-de-aura-25",
    ]),
    effects: [
      {
        type: "upgrade_mult",
        targetUpgradeId: "campo-de-aura",
        multiplier: 2,
      },
    ],
  },
  {
    id: "campo-de-aura-100",
    name: "Essência da Vida",
    description:
      "A Aura flui como um rio. Dobra a eficiência do 'Campo de Aura'.",
    cost: reqCost(1100, 100000),
    iconName: "Wind",
    isVisible: reqUpgrade("campo-de-aura-100", "campo-de-aura", 100, [
      "campo-de-aura-50",
    ]),
    effects: [
      {
        type: "upgrade_mult",
        targetUpgradeId: "campo-de-aura",
        multiplier: 2,
      },
    ],
  },
  {
    id: "mina-de-cristal-1",
    name: "Cristal Puro",
    description: "Torna a 'Mina de Cristal' duas vezes mais eficiente.",
    cost: reqCost(12000, 10),
    iconName: "Diamond",
    isVisible: reqUpgrade("mina-de-cristal-1", "mina-de-cristal", 1),
    effects: [
      {
        type: "upgrade_mult",
        targetUpgradeId: "mina-de-cristal",
        multiplier: 2,
      },
    ],
  },
  {
    id: "mina-de-cristal-5",
    name: "Drusa Energética",
    description: "Cristais maiores, mais poder. Dobra a 'Mina de Cristal'.",
    cost: reqCost(12000, 50),
    iconName: "Pyramid",
    isVisible: reqUpgrade("mina-de-cristal-5", "mina-de-cristal", 5, [
      "mina-de-cristal-1",
    ]),
    effects: [
      {
        type: "upgrade_mult",
        targetUpgradeId: "mina-de-cristal",
        multiplier: 2,
      },
    ],
  },
  {
    id: "mina-de-cristal-25",
    name: "Veio Mãe",
    description: "Você encontrou o veio principal. Dobra a 'Mina de Cristal'.",
    cost: reqCost(12000, 1000),
    iconName: "Mountain",
    isVisible: reqUpgrade("mina-de-cristal-25", "mina-de-cristal", 25, [
      "mina-de-cristal-5",
    ]),
    effects: [
      {
        type: "upgrade_mult",
        targetUpgradeId: "mina-de-cristal",
        multiplier: 2,
      },
    ],
  },
  {
    id: "mina-de-cristal-50",
    name: "Ressonância Harmônica",
    description: "Os cristais cantam sua sintonia. Dobra a 'Mina de Cristal'.",
    cost: reqCost(12000, 10000),
    iconName: "Pickaxe",
    isVisible: reqUpgrade("mina-de-cristal-50", "mina-de-cristal", 50, [
      "mina-de-cristal-25",
    ]),
    effects: [
      {
        type: "upgrade_mult",
        targetUpgradeId: "mina-de-cristal",
        multiplier: 2,
      },
    ],
  },
  {
    id: "mina-de-cristal-100",
    name: "Coração de Cristal",
    description: "O coração da montanha é seu. Dobra a 'Mina de Cristal'.",
    cost: reqCost(12000, 100000),
    iconName: "HeartCrack",
    isVisible: reqUpgrade("mina-de-cristal-100", "mina-de-cristal", 100, [
      "mina-de-cristal-50",
    ]),
    effects: [
      {
        type: "upgrade_mult",
        targetUpgradeId: "mina-de-cristal",
        multiplier: 2,
      },
    ],
  },
  {
    id: "forja-eterea-1",
    name: "Alquimia Avançada",
    description: "Torna a 'Forja Etérea' duas vezes mais eficiente.",
    cost: reqCost(130000, 10),
    iconName: "Hammer",
    isVisible: reqUpgrade("forja-eterea-1", "forja-eterea", 1),
    effects: [
      {
        type: "upgrade_mult",
        targetUpgradeId: "forja-eterea",
        multiplier: 2,
      },
    ],
  },
  {
    id: "forja-eterea-5",
    name: "Produção Espiritual",
    description: "Produção em massa de poder. Dobra a 'Forja Etérea'.",
    cost: reqCost(130000, 50),
    iconName: "Factory",
    isVisible: reqUpgrade("forja-eterea-5", "forja-eterea", 5, [
      "forja-eterea-1",
    ]),
    effects: [
      {
        type: "upgrade_mult",
        targetUpgradeId: "forja-eterea",
        multiplier: 2,
      },
    ],
  },
  {
    id: "forja-eterea-25",
    name: "Replicação Astral",
    description: "A Forja nunca dorme. Dobra a 'Forja Etérea'.",
    cost: reqCost(130000, 1000),
    iconName: "Copy",
    isVisible: reqUpgrade("forja-eterea-25", "forja-eterea", 25, [
      "forja-eterea-5",
    ]),
    effects: [
      {
        type: "upgrade_mult",
        targetUpgradeId: "forja-eterea",
        multiplier: 2,
      },
    ],
  },
  {
    id: "forja-eterea-50",
    name: "Matriz de Energia",
    description: "Matéria é só uma sugestão. Dobra a 'Forja Etérea'.",
    cost: reqCost(130000, 10000),
    iconName: "Database",
    isVisible: reqUpgrade("forja-eterea-50", "forja-eterea", 50, [
      "forja-eterea-25",
    ]),
    effects: [
      {
        type: "upgrade_mult",
        targetUpgradeId: "forja-eterea",
        multiplier: 2,
      },
    ],
  },
  {
    id: "forja-eterea-100",
    name: "Singularidade",
    description: "Você forja a própria realidade. Dobra a 'Forja Etérea'.",
    cost: reqCost(130000, 100000),
    iconName: "Atom",
    isVisible: reqUpgrade("forja-eterea-100", "forja-eterea", 100, [
      "forja-eterea-50",
    ]),
    effects: [
      {
        type: "upgrade_mult",
        targetUpgradeId: "forja-eterea",
        multiplier: 2,
      },
    ],
  },
  {
    id: "banco-astral-1",
    name: "Juros Compostos",
    description: "Torna o 'Banco Astral' duas vezes mais eficiente.",
    cost: reqCost(1400000, 10),
    iconName: "Banknote",
    isVisible: reqUpgrade("banco-astral-1", "banco-astral", 1),
    effects: [
      {
        type: "upgrade_mult",
        targetUpgradeId: "banco-astral",
        multiplier: 2,
      },
    ],
  },
  {
    id: "banco-astral-5",
    name: "Cofre Celestial",
    description: "Seu crédito é cósmico. Dobra a eficiência do 'Banco Astral'.",
    cost: reqCost(1400000, 50),
    iconName: "PiggyBank",
    isVisible: reqUpgrade("banco-astral-5", "banco-astral", 5, [
      "banco-astral-1",
    ]),
    effects: [
      {
        type: "upgrade_mult",
        targetUpgradeId: "banco-astral",
        multiplier: 2,
      },
    ],
  },
  {
    id: "banco-astral-25",
    name: "Fluxo de Capital Divino",
    description: "Aura chama Aura. Dobra a eficiência do 'Banco Astral'.",
    cost: reqCost(1400000, 1000),
    iconName: "TrendingUp",
    isVisible: reqUpgrade("banco-astral-25", "banco-astral", 25, [
      "banco-astral-5",
    ]),
    effects: [
      {
        type: "upgrade_mult",
        targetUpgradeId: "banco-astral",
        multiplier: 2,
      },
    ],
  },
  {
    id: "banco-astral-50",
    name: "Riqueza Incalculável",
    description: "Riqueza inimaginável. Dobra a eficiência do 'Banco Astral'.",
    cost: reqCost(1400000, 10000),
    iconName: "Coins",
    isVisible: reqUpgrade("banco-astral-50", "banco-astral", 50, [
      "banco-astral-25",
    ]),
    effects: [
      {
        type: "upgrade_mult",
        targetUpgradeId: "banco-astral",
        multiplier: 2,
      },
    ],
  },
  {
    id: "banco-astral-100",
    name: "Ouro Alquímico",
    description: "O toque de Midas. Dobra a eficiência do 'Banco Astral'.",
    cost: reqCost(1400000, 100000),
    iconName: "BadgeDollarSign",
    isVisible: reqUpgrade("banco-astral-100", "banco-astral", 100, [
      "banco-astral-50",
    ]),
    effects: [
      {
        type: "upgrade_mult",
        targetUpgradeId: "banco-astral",
        multiplier: 2,
      },
    ],
  },
  {
    id: "templo-da-consciencia-1",
    name: "Votos Sagrados",
    description: "Torna o 'Templo' duas vezes mais eficiente.",
    cost: reqCost(20000000, 10),
    iconName: "Church",
    isVisible: reqUpgrade(
      "templo-da-consciencia-1",
      "templo-da-consciencia",
      1
    ),
    effects: [
      {
        type: "upgrade_mult",
        targetUpgradeId: "templo-da-consciencia",
        multiplier: 2,
      },
    ],
  },
  {
    id: "templo-da-consciencia-5",
    name: "Grande Revelação",
    description:
      "Grandes epifanias geram Aura. Dobra a eficiência do 'Templo'.",
    cost: reqCost(20000000, 50),
    iconName: "Sunrise",
    isVisible: reqUpgrade(
      "templo-da-consciencia-5",
      "templo-da-consciencia",
      5,
      ["templo-da-consciencia-1"]
    ),
    effects: [
      {
        type: "upgrade_mult",
        targetUpgradeId: "templo-da-consciencia",
        multiplier: 2,
      },
    ],
  },
  {
    id: "templo-da-consciencia-25",
    name: "Nirvana",
    description: "O Templo se torna um farol. Dobra a eficiência.",
    cost: reqCost(20000000, 1000),
    iconName: "GalleryVertical",
    isVisible: reqUpgrade(
      "templo-da-consciencia-25",
      "templo-da-consciencia",
      25,
      ["templo-da-consciencia-5"]
    ),
    effects: [
      {
        type: "upgrade_mult",
        targetUpgradeId: "templo-da-consciencia",
        multiplier: 2,
      },
    ],
  },
  {
    id: "templo-da-consciencia-50",
    name: "Unidade com o Todo",
    description:
      "Unidade com o todo, mas com lucro. Dobra a eficiência do 'Templo'.",
    cost: reqCost(20000000, 10000),
    iconName: "Orbit",
    isVisible: reqUpgrade(
      "templo-da-consciencia-50",
      "templo-da-consciencia",
      50,
      ["templo-da-consciencia-25"]
    ),
    effects: [
      {
        type: "upgrade_mult",
        targetUpgradeId: "templo-da-consciencia",
        multiplier: 2,
      },
    ],
  },
  {
    id: "templo-da-consciencia-100",
    name: "A Própria Aura",
    description: "Você é a própria Aura. Dobra a eficiência do 'Templo'.",
    cost: reqCost(20000000, 100000),
    iconName: "SunDim",
    isVisible: reqUpgrade(
      "templo-da-consciencia-100",
      "templo-da-consciencia",
      100,
      ["templo-da-consciencia-50"]
    ),
    effects: [
      {
        type: "upgrade_mult",
        targetUpgradeId: "templo-da-consciencia",
        multiplier: 2,
      },
    ],
  },
  {
    id: "torre-do-arcanjo-1",
    name: "Runas Antigas",
    description: "Torna a 'Torre do Arcanjo' duas vezes mais eficiente.",
    cost: reqCost(330000000, 10),
    iconName: "BookMarked",
    isVisible: reqUpgrade("torre-do-arcanjo-1", "torre-do-arcanjo", 1),
    effects: [
      {
        type: "upgrade_mult",
        targetUpgradeId: "torre-do-arcanjo",
        multiplier: 2,
      },
    ],
  },
  {
    id: "torre-do-arcanjo-5",
    name: "Grimório Proibido",
    description: "Poder direto da fonte. Dobra a eficiência da 'Torre'.",
    cost: reqCost(330000000, 50),
    iconName: "BookLock",
    isVisible: reqUpgrade("torre-do-arcanjo-5", "torre-do-arcanjo", 5, [
      "torre-do-arcanjo-1",
    ]),
    effects: [
      {
        type: "upgrade_mult",
        targetUpgradeId: "torre-do-arcanjo",
        multiplier: 2,
      },
    ],
  },
  {
    id: "torre-do-arcanjo-25",
    name: "Feitiço de Invocação",
    description: "Invocando poder em escala. Dobra a eficiência da 'Torre'.",
    cost: reqCost(330000000, 1000),
    iconName: "Wand",
    isVisible: reqUpgrade("torre-do-arcanjo-25", "torre-do-arcanjo", 25, [
      "torre-do-arcanjo-5",
    ]),
    effects: [
      {
        type: "upgrade_mult",
        targetUpgradeId: "torre-do-arcanjo",
        multiplier: 2,
      },
    ],
  },
  {
    id: "torre-do-arcanjo-50",
    name: "Manipulação do Éter",
    description:
      "Manipulando o tecido da realidade. Dobra a eficiência da 'Torre'.",
    cost: reqCost(330000000, 10000),
    iconName: "Waves",
    isVisible: reqUpgrade("torre-do-arcanjo-50", "torre-do-arcanjo", 50, [
      "torre-do-arcanjo-25",
    ]),
    effects: [
      {
        type: "upgrade_mult",
        targetUpgradeId: "torre-do-arcanjo",
        multiplier: 2,
      },
    ],
  },
  {
    id: "torre-do-arcanjo-100",
    name: "Poder Celestial",
    description: "Poder celestial absoluto. Dobra a eficiência da 'Torre'.",
    cost: reqCost(330000000, 100000),
    iconName: "Star",
    isVisible: reqUpgrade("torre-do-arcanjo-100", "torre-do-arcanjo", 100, [
      "torre-do-arcanjo-50",
    ]),
    effects: [
      {
        type: "upgrade_mult",
        targetUpgradeId: "torre-do-arcanjo",
        multiplier: 2,
      },
    ],
  },

  {
    id: "sinergia-meditacao-campo",
    name: "Cultivo Zen",
    description:
      "'Meditação' fica 2x mais eficiente. 'Campo de Aura' ganha +1% de CPS para cada 'Meditação'.",
    cost: 55000,
    iconName: "Recycle",
    isVisible: (state: AuraState) =>
      (state.upgradeCounts["meditacao"] || 0) >= 15 &&
      (state.upgradeCounts["campo-de-aura"] || 0) >= 1 &&
      !state.purchasedImprovements.includes("sinergia-meditacao-campo"),
    effects: [
      { type: "upgrade_mult", targetUpgradeId: "meditacao", multiplier: 2 },
      {
        type: "synergy_cross",
        targetUpgradeId: "campo-de-aura",
        sourceUpgradeId: "meditacao",
        bonusPerSource: 0.01,
      },
    ],
  },
  {
    id: "sinergia-meditacao-mina",
    name: "Meditação Cristalina",
    description:
      "'Meditação' fica 2x mais eficiente. 'Minas de Cristal' ganham +1% de CPS para cada 2 'Meditações'.",
    cost: 600000,
    iconName: "Gem",
    isVisible: (state: AuraState) =>
      (state.upgradeCounts["meditacao"] || 0) >= 15 &&
      (state.upgradeCounts["mina-de-cristal"] || 0) >= 1 &&
      !state.purchasedImprovements.includes("sinergia-meditacao-mina"),
    effects: [
      { type: "upgrade_mult", targetUpgradeId: "meditacao", multiplier: 2 },
      {
        type: "synergy_cross",
        targetUpgradeId: "mina-de-cristal",
        sourceUpgradeId: "meditacao",
        bonusPerSource: 0.005,
      },
    ],
  },
  {
    id: "sinergia-meditacao-forja",
    name: "Mente Alquímica",
    description:
      "'Meditação' fica 2x mais eficiente. 'Forjas' ganham +1% de CPS para cada 3 'Meditações'.",
    cost: 6500000,
    iconName: "TestTube",
    isVisible: (state: AuraState) =>
      (state.upgradeCounts["meditacao"] || 0) >= 15 &&
      (state.upgradeCounts["forja-eterea"] || 0) >= 1 &&
      !state.purchasedImprovements.includes("sinergia-meditacao-forja"),
    effects: [
      { type: "upgrade_mult", targetUpgradeId: "meditacao", multiplier: 2 },
      {
        type: "synergy_cross",
        targetUpgradeId: "forja-eterea",
        sourceUpgradeId: "meditacao",
        bonusPerSource: 0.0033,
      },
    ],
  },
  {
    id: "sinergia-meditacao-banco",
    name: "CEO Espiritual",
    description:
      "'Meditação' fica 2x mais eficiente. 'Bancos' ganham +1% de CPS para cada 4 'Meditações'.",
    cost: 70000000,
    iconName: "AreaChart",
    isVisible: (state: AuraState) =>
      (state.upgradeCounts["meditacao"] || 0) >= 15 &&
      (state.upgradeCounts["banco-astral"] || 0) >= 1 &&
      !state.purchasedImprovements.includes("sinergia-meditacao-banco"),
    effects: [
      { type: "upgrade_mult", targetUpgradeId: "meditacao", multiplier: 2 },
      {
        type: "synergy_cross",
        targetUpgradeId: "banco-astral",
        sourceUpgradeId: "meditacao",
        bonusPerSource: 0.0025,
      },
    ],
  },
  {
    id: "sinergia-meditacao-templo",
    name: "Devoção Cega",
    description:
      "'Meditação' fica 2x mais eficiente. 'Templos' ganham +1% de CPS para cada 5 'Meditações'.",
    cost: 1000000000,
    iconName: "HandHeart",
    isVisible: (state: AuraState) =>
      (state.upgradeCounts["meditacao"] || 0) >= 15 &&
      (state.upgradeCounts["templo-da-consciencia"] || 0) >= 1 &&
      !state.purchasedImprovements.includes("sinergia-meditacao-templo"),
    effects: [
      { type: "upgrade_mult", targetUpgradeId: "meditacao", multiplier: 2 },
      {
        type: "synergy_cross",
        targetUpgradeId: "templo-da-consciencia",
        sourceUpgradeId: "meditacao",
        bonusPerSource: 0.002,
      },
    ],
  },
  {
    id: "sinergia-meditacao-torre",
    name: "Telepatia Arcana",
    description:
      "'Meditação' fica 2x mais eficiente. 'Torres' ganham +1% de CPS para cada 6 'Meditações'.",
    cost: 16500000000,
    iconName: "Wifi",
    isVisible: (state: AuraState) =>
      (state.upgradeCounts["meditacao"] || 0) >= 15 &&
      (state.upgradeCounts["torre-do-arcanjo"] || 0) >= 1 &&
      !state.purchasedImprovements.includes("sinergia-meditacao-torre"),
    effects: [
      { type: "upgrade_mult", targetUpgradeId: "meditacao", multiplier: 2 },
      {
        type: "synergy_cross",
        targetUpgradeId: "torre-do-arcanjo",
        sourceUpgradeId: "meditacao",
        bonusPerSource: 0.00166,
      },
    ],
  },

  {
    id: "sinergia-campo-templo",
    name: "Prece pela Colheita",
    description:
      "'Campo de Aura' fica 5% mais forte para cada 'Templo'. 'Templo' fica 0.1% mais forte para cada 'Campo de Aura'.",
    cost: 1100000000,
    iconName: "CloudRain",
    isVisible: (state: AuraState) =>
      (state.upgradeCounts["campo-de-aura"] || 0) >= 75 &&
      (state.upgradeCounts["templo-da-consciencia"] || 0) >= 75 &&
      !state.purchasedImprovements.includes("sinergia-campo-templo"),
    effects: [
      {
        type: "synergy_cross",
        targetUpgradeId: "campo-de-aura",
        sourceUpgradeId: "templo-da-consciencia",
        bonusPerSource: 0.05,
      },
      {
        type: "synergy_cross",
        targetUpgradeId: "templo-da-consciencia",
        sourceUpgradeId: "campo-de-aura",
        bonusPerSource: 0.001,
      },
    ],
  },
  {
    id: "sinergia-mina-forja",
    name: "Forja Geotérmica",
    description:
      "'Mina de Cristal' fica 5% mais forte para cada 'Forja'. 'Forja' fica 0.1% mais forte para cada 'Mina'.",
    cost: 1300000000,
    iconName: "Replace",
    isVisible: (state: AuraState) =>
      (state.upgradeCounts["mina-de-cristal"] || 0) >= 75 &&
      (state.upgradeCounts["forja-eterea"] || 0) >= 75 &&
      !state.purchasedImprovements.includes("sinergia-mina-forja"),
    effects: [
      {
        type: "synergy_cross",
        targetUpgradeId: "mina-de-cristal",
        sourceUpgradeId: "forja-eterea",
        bonusPerSource: 0.05,
      },
      {
        type: "synergy_cross",
        targetUpgradeId: "forja-eterea",
        sourceUpgradeId: "mina-de-cristal",
        bonusPerSource: 0.001,
      },
    ],
  },
  {
    id: "sinergia-banco-templo",
    name: "Financiamento Divino",
    description:
      "'Banco Astral' fica 5% mais forte para cada 'Templo'. 'Templo' fica 0.1% mais forte para cada 'Banco'.",
    cost: 20000000000,
    iconName: "Scale",
    isVisible: (state: AuraState) =>
      (state.upgradeCounts["banco-astral"] || 0) >= 75 &&
      (state.upgradeCounts["templo-da-consciencia"] || 0) >= 75 &&
      !state.purchasedImprovements.includes("sinergia-banco-templo"),
    effects: [
      {
        type: "synergy_cross",
        targetUpgradeId: "banco-astral",
        sourceUpgradeId: "templo-da-consciencia",
        bonusPerSource: 0.05,
      },
      {
        type: "synergy_cross",
        targetUpgradeId: "templo-da-consciencia",
        sourceUpgradeId: "banco-astral",
        bonusPerSource: 0.001,
      },
    ],
  },
  {
    id: "sinergia-forja-torre",
    name: "Alquimia Arcana",
    description:
      "'Forja Etérea' fica 5% mais forte para cada 'Torre'. 'Torre' fica 0.1% mais forte para cada 'Forja'.",
    cost: 330000000000,
    iconName: "FlaskConical",
    isVisible: (state: AuraState) =>
      (state.upgradeCounts["forja-eterea"] || 0) >= 75 &&
      (state.upgradeCounts["torre-do-arcanjo"] || 0) >= 75 &&
      !state.purchasedImprovements.includes("sinergia-forja-torre"),
    effects: [
      {
        type: "synergy_cross",
        targetUpgradeId: "forja-eterea",
        sourceUpgradeId: "torre-do-arcanjo",
        bonusPerSource: 0.05,
      },
      {
        type: "synergy_cross",
        targetUpgradeId: "torre-do-arcanjo",
        sourceUpgradeId: "forja-eterea",
        bonusPerSource: 0.001,
      },
    ],
  },

  {
    id: "cps-clique-1",
    name: "Manifestação Instantânea",
    description: "Seu clique agora também manifesta 1% do seu CPS total.",
    cost: 1000000,
    iconName: "Zap",
    isVisible: reqCps("cps-clique-1", 100),
    effects: [{ type: "global_click_cps_bonus", bonusPercentage: 0.01 }],
  },
  {
    id: "cps-clique-2",
    name: "Eco da Realidade",
    description:
      "Aumenta o bônus de manifestação do clique para 2% do seu CPS total.",
    cost: 1000000000,
    iconName: "IterationCcw",
    isVisible: reqCps("cps-clique-2", 10000, ["cps-clique-1"]),
    effects: [{ type: "global_click_cps_bonus", bonusPercentage: 0.01 }],
  },
  {
    id: "cps-clique-3",
    name: "Onipresença",
    description:
      "Aumenta o bônus de manifestação do clique para 5% do seu CPS total.",
    cost: 1000000000000,
    iconName: "Footprints",
    isVisible: reqCps("cps-clique-3", 1000000, ["cps-clique-2"]),
    effects: [{ type: "global_click_cps_bonus", bonusPercentage: 0.03 }],
  },
  {
    id: "cps-clique-4",
    name: "Deus Ex Machina",
    description:
      "Aumenta o bônus de manifestação do clique para 10% do seu CPS total.",
    cost: 1000000000000000,
    iconName: "Atom",
    isVisible: reqCps("cps-clique-4", 100000000, ["cps-clique-3"]),
    effects: [{ type: "global_click_cps_bonus", bonusPercentage: 0.05 }],
  },
];
