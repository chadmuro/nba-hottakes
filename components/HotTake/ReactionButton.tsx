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
  const { loading, addReaction, deleteReaction, updating } = useReaction();
  const session = useSession();

  const selectedReaction = hotTakeReactions.find(
    (htReaction) => htReaction.reaction === reaction
  );

  function onReactionClick() {
    if (!session?.user.id || updating) {
      return;
    }
    if (selectedReaction) {
      return deleteReaction(selectedReaction.id);
    }
    return addReaction(hotTakeId, reaction);
  }

  return (
    <label
      htmlFor={session?.user.id ? "" : "login-modal"}
      className={`text-primary-content border border-primary-content rounded-2xl py-1 px-2 cursor-pointer ${
        selectedReaction ? "bg-accent" : "bg-primary-focus"
      } ${loading ? "pointer-events-none" : "pointer-events-auto"}`}
      onClick={onReactionClick}
    >
      {text}
    </label>
  );
}
