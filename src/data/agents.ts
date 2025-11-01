export interface Honor {
  title: string;
  description: string;
  date: string;
}

export interface Clip {
  url: string;
  title?: string;
  agentNick: string;
  date: string;
  tags: string[];
}

export interface AgentLogin {
  lastDateLogin: string;
  totalDays: number;
  currentStreakDays: number;
  maxStreakDays: number;
}

export interface AgentEvents {
  totalPlayed: number;
  firstPlaceWins: number;
  totalScore: number;
}

interface SocialLinks {
  twitch?: string | null;
  youtube?: string | null;
  instagram?: string | null;
}

interface AgentArt {
  cover: string;
  full: string | null;
}

export interface Agent {
  id: string;
  nick: string;
  squad: "VULCANO" | "ETER" | "SABRE" | "ORACULO" | null;
  discordTag: string;
  birthday: string;
  joinedAt: string;
  games: string[];
  favoriteGame: string | null;
  description: string | null;
  gender: "masculino" | "feminino";
  videoPentakill?: string | null;
  art?: AgentArt;
  role?: string | null;
  specialty?: string | null;
  catchphrase?: string | null;
  isActive?: boolean;
  social?: SocialLinks;
  unlockedAt: string;
  score: number;
  lastUpdate: string;
  emblems: string[];
  openBoxes: string[];
  clips: Clip[];
  login: AgentLogin;
  events: AgentEvents;
  invitedFriendsCount: number;
  totalNitroBoosts: number;
  honors: Honor[];
  emblemsSelected: string[];
}

export interface AuthAgent extends Agent {
  password?: string;
}

export interface AuthAgentWithDocId extends AuthAgent {
  docId: string;
}

const parseDate = (dateString: string): Date => {
  const [day, month, year] = dateString.split("/").map(Number);
  return new Date(year, month - 1, day);
};

export const getLastUnlockedAgent = (agents: Agent[]): Agent | null => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const unlockedAgents = agents.filter((agent) => {
    return parseDate(agent.unlockedAt).getTime() <= today.getTime();
  });

  if (unlockedAgents.length === 0) {
    return null;
  }

  unlockedAgents.sort((a, b) => {
    return (
      parseDate(b.unlockedAt).getTime() - parseDate(a.unlockedAt).getTime()
    );
  });

  return unlockedAgents[0];
};

export const getNextAgentToUnlock = (agents: Agent[]): Agent | null => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingAgents = agents.filter((agent) => {
    return parseDate(agent.unlockedAt).getTime() > today.getTime();
  });

  if (upcomingAgents.length === 0) {
    return null;
  }

  upcomingAgents.sort((a, b) => {
    return (
      parseDate(a.unlockedAt).getTime() - parseDate(b.unlockedAt).getTime()
    );
  });

  return upcomingAgents[0];
};

export const getAgentsRemainingToUnlock = (agents: Agent[]): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const remainingAgents = agents.filter((agent) => {
    return parseDate(agent.unlockedAt).getTime() > today.getTime();
  });

  return remainingAgents.length;
};
