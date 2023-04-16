import { useSession } from "@supabase/auth-helpers-react";
import { useReaction } from "../../contexts/reactionContext";
import { Reaction, ReactionEnum } from "../../types/common";

interface Props {
  text: string;
  reaction: ReactionEnum;
  hotTakeId: string;
  hotTakeReactions: Reaction[];
}

export default function ReactionButton({
  text,
  reaction,
  hotTakeId,
  hotTakeReactions,
}: Props) {
  const { loading, addReaction } = useReaction();
  const session = useSession();

  function onReactionClick() {
    if (!session?.user.id) {
      return;
    }
    addReaction(hotTakeId, reaction);
  }

  return (
    <label
      htmlFor={session?.user.id ? "" : "login-modal"}
      className={`text-primary-content border border-primary-content rounded-2xl py-1 px-2 cursor-pointer ${
        hotTakeReactions.find((htReaction) => htReaction.reaction === reaction)
          ? "bg-accent"
          : "bg-primary-focus"
      } ${loading ? "pointer-events-none" : "pointer-events-auto"}`}
      onClick={onReactionClick}
    >
      {text}
    </label>
  );
}
