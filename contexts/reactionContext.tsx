import { createContext, PropsWithChildren, useContext } from "react";
import { Reaction, ReactionEnum } from "../types/common";

type ReactionContextType = {
  // reactions: Reaction[];
  addReaction: (hottakeId: string, reaction: ReactionEnum) => void;
  // deleteReaction: (reactiunId: string) => void;
  // loading: boolean;
};

export const ReactionContext = createContext<ReactionContextType | undefined>(
  undefined
);

const ReactionProvider = ({ children }: PropsWithChildren<{}>) => {
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
        console.log(data);
      }
    } catch (err) {
      // TODO: display toast
    }
  }

  const value = { addReaction };

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
