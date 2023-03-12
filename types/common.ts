import { Team } from "./teams";

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
