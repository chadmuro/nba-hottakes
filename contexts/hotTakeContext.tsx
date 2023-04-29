import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { createContext, PropsWithChildren, useContext, useState } from "react";
import toast from "react-hot-toast";
import { HotTake, ReactionEnum } from "../types/common";

type HotTakeContextType = {
  loading: boolean;
  hotTakes: HotTake[];
  count: number | null;
  getHotTakes: (searchPeriod: string) => Promise<void>;
  getMyHotTakes: (userId: string) => Promise<void>;
  getMyReactions: (userId: string) => Promise<void>;
  updateHotTake: (
    reactionId: string,
    type: "add" | "delete",
    hotTakeId: string,
    reaction?: ReactionEnum
  ) => Promise<void>;
  deleteHotTake: (hotTakeId: string) => Promise<void>;
};

export const HotTakeContext = createContext<HotTakeContextType | undefined>(
  undefined
);

const HotTakeProvider = ({ children }: PropsWithChildren<{}>) => {
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState<number | null>(null);
  const [hotTakes, setHotTakes] = useState<HotTake[]>([]);

  const supabase = useSupabaseClient();

  async function getHotTakes(searchPeriod: string) {
    try {
      setLoading(true);
      const { data, count: numberOfHotTakes } = await supabase
        .from("hottakes")
        .select(
          `id, created_at, message, linked_teams, user(id, username, favorite_team), reactions(id, reaction)`,
          { count: "exact" }
        )
        .neq("deleted", "1")
        .gt("created_at", searchPeriod)
        .order("created_at", { ascending: false });

      setHotTakes(data as HotTake[]);
      setCount(numberOfHotTakes);
    } catch (err) {
      setCount(null);
      setHotTakes([]);
    } finally {
      setLoading(false);
    }
  }

  async function getMyHotTakes(userId: string) {
    try {
      setLoading(true);
      const { data } = await supabase
        .from("hottakes")
        .select(
          `id, created_at, message, linked_teams, user(id, username, favorite_team), reactions(id, reaction)`
        )
        .neq("deleted", "1")
        .eq("user", userId)
        .order("created_at", { ascending: false });

      setHotTakes(data as HotTake[]);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  }

  async function getMyReactions(userId: string) {
    try {
      setLoading(true);
      const { data } = await supabase
        .from("reactions")
        .select(`id, reaction, hottake`)
        .eq("user", userId);

      const reactionIds = data?.map((reaction) => reaction.hottake);

      const { data: hotTakeData } = await supabase
        .from("hottakes")
        .select(
          `id, created_at, message, linked_teams, user(id, username, favorite_team), reactions(id, reaction)`
        )
        .neq("deleted", "1")
        .in("id", reactionIds as string[])
        .order("created_at", { ascending: false });

      setHotTakes(hotTakeData as HotTake[]);
    } catch (err) {
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

  async function deleteHotTake(hotTakeId: string) {
    const { error } = await supabase
      .from("hottakes")
      .delete()
      .eq("id", hotTakeId);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Hot take deleted");
    setHotTakes((prevData) => prevData.filter((item) => item.id !== hotTakeId));
  }

  const value = {
    loading,
    count,
    hotTakes,
    getHotTakes,
    getMyHotTakes,
    getMyReactions,
    updateHotTake,
    deleteHotTake,
  };

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
