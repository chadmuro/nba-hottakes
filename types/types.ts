export type HotTake = {
  created_at: string;
  deleted: 0 | 1;
  id: string;
  linked_teams: number[];
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
  name: string;
  avatar: string;
  favorite_team: number;
};
