import { useSupabaseClient } from "@supabase/auth-helpers-react";
import dayjs from "dayjs";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
  useEffect,
} from "react";
import toast from "react-hot-toast";
import { HotTake, ReactionEnum } from "../types/common";

export type SearchPeriod = "week" | "month" | "year" | "alltime";
export type FilterSort = "recent" | "hottest" | "coldest" | "trashest";

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
  deleteHotTake: (hotTakeId: string) => Promise<void>;
  period: SearchPeriod;
  setPeriod: React.Dispatch<React.SetStateAction<SearchPeriod>>;
  sort: FilterSort;
  setSort: React.Dispatch<React.SetStateAction<FilterSort>>;
};

export const HotTakeContext = createContext<HotTakeContextType | undefined>(
  undefined
);

const HotTakeProvider = ({ children }: PropsWithChildren<{}>) => {
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState<SearchPeriod>("week");
  const [sort, setSort] = useState<FilterSort>("recent");

  const [count, setCount] = useState<number | null>(null);
  const [hotTakes, setHotTakes] = useState<HotTake[]>([]);

  const supabase = useSupabaseClient();

  let searchPeriod: string | undefined = dayjs()
    .subtract(1, "week")
    .toISOString();
  if (period === "month") {
    searchPeriod = dayjs().subtract(1, "month").toISOString();
  } else if (period === "year") {
    searchPeriod = dayjs().subtract(1, "year").toISOString();
  } else if (period === "alltime") {
    searchPeriod = dayjs()
      .set("year", 2023)
      .set("month", 3)
      .set("date", 1)
      .toISOString();
  }

  useEffect(() => {
    async function getHotTakes() {
      try {
        setLoading(true);
        setSort("recent");
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
    console.log("fetch hotTakes");
    getHotTakes();
    // TODO: Fix useEffect dependency array
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase, period]);

  async function refreshHotTakes() {
    try {
      setLoading(true);
      setSort("recent");
      const { data, count: numberOfHotTakes } = await supabase
        .from("hottakes")
        .select(
          `id, created_at, message, linked_teams, user(id, username, favorite_team), reactions(id, reaction)`,
          { count: "exact" }
        )
        .neq("deleted", "1")
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
    refreshHotTakes,
    updateHotTake,
    deleteHotTake,
    period,
    setPeriod,
    sort,
    setSort,
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
