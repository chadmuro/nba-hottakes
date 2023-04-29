import dayjs from "dayjs";
import { HotTake, ReactionEnum } from "../types/common";

export function compareHottest(a: HotTake, b: HotTake) {
  return (
    b.reactions.filter((reaction) => reaction.reaction === ReactionEnum.fire)
      .length -
    a.reactions.filter((reaction) => reaction.reaction === ReactionEnum.fire)
      .length
  );
}

export function compareColdest(a: HotTake, b: HotTake) {
  return (
    b.reactions.filter((reaction) => reaction.reaction === ReactionEnum.cold)
      .length -
    a.reactions.filter((reaction) => reaction.reaction === ReactionEnum.cold)
      .length
  );
}

export function compareTrashest(a: HotTake, b: HotTake) {
  return (
    b.reactions.filter((reaction) => reaction.reaction === ReactionEnum.trash)
      .length -
    a.reactions.filter((reaction) => reaction.reaction === ReactionEnum.trash)
      .length
  );
}

export function compareRecent(a: HotTake, b: HotTake) {
  return dayjs(b.created_at).valueOf() - dayjs(a.created_at).valueOf();
}
