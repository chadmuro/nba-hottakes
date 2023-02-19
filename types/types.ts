export type HotTake = {
  created_at: string;
  id: string;
  linked_teams: Team[];
  message: string;
  user: User;
  reactions: {
    hot: number;
    cold: number;
    trash: number;
  };
};

export type User = {
  id: string;
  username: string;
  avatar: string;
  favorite_team: Team;
};

export type Reaction = {
  user_id: string;
  hottake_id: string;
  reaction: ReactionEnum;
};

enum ReactionEnum {
  "fire",
  "cold",
  "trash",
}

export type Team = keyof typeof teams;

export const teams = {
  1: {
    id: 1,
    abbreviaton: "ATL",
    city: "Atlanta",
    name: "Hawks",
    full_name: "Atlanta Hawks",
    logo_path: "/teams/ATL_logo.svg",
  },
  2: {
    id: 2,
    abbreviaton: "BOS",
    city: "Boston",
    name: "Celtics",
    full_name: "Boston Celtics",
    logo_path: "/teams/BOS_logo.svg",
  },
  3: {
    id: 3,
    abbreviaton: "BKN",
    city: "Brooklyn",
    name: "Nets",
    full_name: "Brooklyn Nets",
    logo_path: "/teams/BKN_logo.svg",
  },
  4: {
    id: 4,
    abbreviaton: "CHA",
    city: "Charlotte",
    name: "Hornets",
    full_name: "Charlotte Hornets",
    logo_path: "/teams/CHA_logo.svg",
  },
  5: {
    id: 5,
    abbreviaton: "CHI",
    city: "Chicago",
    name: "Bulls",
    full_name: "Chicago Bulls",
    logo_path: "/teams/CHI_logo.svg",
  },
};
