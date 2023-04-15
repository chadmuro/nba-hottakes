import { Reaction, ReactionEnum } from "../types/common";

export function calculateReactions(reactions: Reaction[]) {
  let fire = 0;
  let cold = 0;
  let trash = 0;

  reactions.forEach((reaction) => {
    if (reaction.reaction === ReactionEnum.fire) {
      fire = fire + 1;
    }
    if (reaction.reaction === ReactionEnum.cold) {
      cold = cold + 1;
    }
    if (reaction.reaction === ReactionEnum.trash) {
      trash = trash + 1;
    }
  });
  return { fire, cold, trash };
}
