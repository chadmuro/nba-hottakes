import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
  useEffect,
} from "react";
import { HotTake, Reaction, ReactionEnum } from "../types/common";

type HotTakeContextType = {
  loading: boolean;
  hotTakes: HotTake[];
  count: number | null;
  refreshHotTakes: () => Promise<void>;
  updateHotTake: (
    reactionId: string,
    type: "add" | "delete",
    hotTakeId: string,
    reaction?: ReactionEnum
  ) => Promise<void>;
};

export const HotTakeContext = createContext<HotTakeContextType | undefined>(
  undefined
);

const HotTakeProvider = ({ children }: PropsWithChildren<{}>) => {
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState<number | null>(null);
  const [hotTakes, setHotTakes] = useState<HotTake[]>([]);

  const supabase = useSupabaseClient();

  useEffect(() => {
    async function getHotTakes() {
      try {
        setLoading(true);
        const { data, count: numberOfHotTakes } = await supabase
          .from("hottakes")
          .select(
            `id, created_at, message, linked_teams, user(id, username, favorite_team), reactions(id, reaction)`,
            { count: "exact" }
          )
          .neq("deleted", "1")
          .order("created_at", { ascending: false })
          .limit(5);

        setHotTakes(data as HotTake[]);
        setCount(numberOfHotTakes);
      } catch (err) {
        setCount(null);
        setHotTakes([]);
      } finally {
        setLoading(false);
      }
    }
    console.log("fetch hotTakes");
    getHotTakes();
  }, [supabase]);

  async function refreshHotTakes() {
    try {
      setLoading(true);
      const { data, count: numberOfHotTakes } = await supabase
        .from("hottakes")
        .select(
          `id, created_at, message, linked_teams, user(id, username, favorite_team), reactions(id, reaction)`,
          { count: "exact" }
        )
        .neq("deleted", "1")
        .order("created_at", { ascending: false })
        .limit(5);

      setHotTakes(data as HotTake[]);
      setCount(numberOfHotTakes);
    } catch (err) {
      setCount(null);
      setHotTakes([]);
    } finally {
      setLoading(false);
    }
  }

  async function updateHotTake(
    reactionId: string,
    type: "add" | "delete",
    hotTakeId: string,
    reaction?: ReactionEnum
  ) {
    setHotTakes((prevData) => {
      const selectedHotTakeIndex = prevData.findIndex(
        (take) => take.id === hotTakeId
      );
      let selectedHotTake = prevData.find((take) => take.id === hotTakeId);

      if (selectedHotTake) {
        if (
          type === "add" &&
          hotTakeId !== undefined &&
          reaction !== undefined
        ) {
          selectedHotTake = {
            ...selectedHotTake,
            reactions: [
              ...selectedHotTake.reactions,
              { id: reactionId, hottake: hotTakeId, reaction },
            ],
          };
        }
        if (type === "delete") {
          const newReactions = selectedHotTake.reactions.filter(
            (reaction) => reaction.id !== reactionId
          );
          selectedHotTake.reactions = [...newReactions];
        }
        prevData[selectedHotTakeIndex] = selectedHotTake;
      }
      return [...prevData];
    });
  }

  const value = { loading, count, hotTakes, refreshHotTakes, updateHotTake };

  return (
    <HotTakeContext.Provider value={value}>{children}</HotTakeContext.Provider>
  );
};

const useHotTake = () => {
  const context = useContext(HotTakeContext);
  if (context === undefined) {
    throw new Error("useHotTake must be used within a HotTakeProvider");
  }
  return context;
};

export { HotTakeProvider, useHotTake };
