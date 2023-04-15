import { useSession } from "@supabase/auth-helpers-react";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
  useEffect,
} from "react";
import { Reaction, ReactionEnum } from "../types/common";

type ReactionContextType = {
  reactions: Reaction[];
  addReaction: (hottakeId: string, reaction: ReactionEnum) => void;
  // deleteReaction: (reactiunId: string) => void;
  loading: boolean;
};

export const ReactionContext = createContext<ReactionContextType | undefined>(
  undefined
);

const ReactionProvider = ({ children }: PropsWithChildren<{}>) => {
  const session = useSession();
  const [loading, setLoading] = useState(false);
  const [reactions, setReactions] = useState<Reaction[]>([]);

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
      const res = await fetch("/api/v1/reaction", {
        method: "POST",
        body: JSON.stringify({
          hottake_id: hottakeId,
          reaction,
        }),
      });

      if (res.status === 200) {
        const data = await res.json();
        // TODO: add data to reactions array
      }
    } catch (err) {
      // TODO: display toast
    }
  }

  const value = { reactions, loading, addReaction };

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
