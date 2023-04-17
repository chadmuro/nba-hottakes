import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
  useEffect,
} from "react";
import { HotTake } from "../types/common";

type HotTakeContextType = {
  loading: boolean;
  hotTakes: HotTake[];
  count: number | null;
  refreshHotTakes: () => Promise<void>;
  // updateHotTake: (hotTakeId: string) => void;
};

export const HotTakeContext = createContext<HotTakeContextType | undefined>(
  undefined
);

const HotTakeProvider = ({ children }: PropsWithChildren<{}>) => {
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState<number | null>(null);
  const [hotTakes, setHotTakes] = useState<HotTake[]>([]);

  const supabase = useSupabaseClient();

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

  const value = { loading, count, hotTakes, refreshHotTakes };

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
