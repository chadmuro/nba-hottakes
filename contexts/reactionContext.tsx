import { useSession } from "@supabase/auth-helpers-react";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
  useEffect,
} from "react";
import { toast } from "react-hot-toast";
import { get_error_message, Reaction, ReactionEnum } from "../types/common";
import { useHotTake } from "./hotTakeContext";

type ReactionContextType = {
  reactions: Reaction[];
  addReaction: (hottakeId: string, reaction: ReactionEnum) => void;
  deleteReaction: (reactionId: string, hotTakeId: string) => void;
  loading: boolean;
  updating: boolean;
};

export const ReactionContext = createContext<ReactionContextType | undefined>(
  undefined
);

const ReactionProvider = ({ children }: PropsWithChildren<{}>) => {
  const session = useSession();
  const [updating, setUpdating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const { updateHotTake } = useHotTake();

  useEffect(() => {
    async function getReactions() {
      try {
        setLoading(true);
        const res = await fetch("/api/v1/reaction", {
          method: "GET",
        });
        if (res.status === 200) {
          const data = await res.json();
          setReactions(data.success.data);
        }
      } catch (err) {
        setReactions([]);
      } finally {
        setLoading(false);
      }
    }
    if (session) {
      getReactions();
    } else {
      setReactions([]);
    }
  }, [session]);

  async function addReaction(hottakeId: string, reaction: ReactionEnum) {
    try {
      setUpdating(true);
      const res = await fetch("/api/v1/reaction", {
        method: "POST",
        body: JSON.stringify({
          hottake_id: hottakeId,
          reaction,
        }),
      });

      if (res.status === 200) {
        const data = await res.json();
        setReactions((prevReactions) => [
          ...prevReactions,
          {
            hottake: data.success.data.hottake,
            id: data.success.data.id,
            reaction: data.success.data.reaction,
          },
        ]);
        updateHotTake(
          data.success.data.id,
          "add",
          hottakeId,
          data.success.data.reaction
        );
        toast.success("Reaction added!");
      }
    } catch (err) {
      toast.error(get_error_message(err));
    } finally {
      setUpdating(false);
    }
  }

  async function deleteReaction(reactionId: string, hotTakeId: string) {
    try {
      setUpdating(true);
      const res = await fetch("/api/v1/reaction", {
        method: "DELETE",
        body: JSON.stringify({
          reaction_id: reactionId,
          hottake_id: hotTakeId,
        }),
      });

      if (res.status === 200) {
        const data = await res.json();
        const deletedReaction = data.success.data.reaction_id;

        setReactions((prevReactions) =>
          prevReactions.filter((reaction) => reaction.id !== deletedReaction)
        );
        updateHotTake(
          data.success.data.reaction_id,
          "delete",
          data.success.data.hottake_id,
          undefined
        );
        toast.success("Reaction removed!");
      }
    } catch (err) {
      toast.error(get_error_message(err));
    } finally {
      setUpdating(false);
    }
  }

  const value = { reactions, loading, updating, addReaction, deleteReaction };

  return (
    <ReactionContext.Provider value={value}>
      {children}
    </ReactionContext.Provider>
  );
};

const useReaction = () => {
  const context = useContext(ReactionContext);
  if (context === undefined) {
    throw new Error("useReaction must be used within a ReactionProvider");
  }
  return context;
};

export { ReactionProvider, useReaction };
