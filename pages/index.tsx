import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import Hero from "../components/Hero";
import HotTakeCard from "../components/HotTake/HotTake";
import { useHotTake } from "../contexts/hotTakeContext";
import DeleteHotTakeModal from "../components/Modal/DeleteHotTakeModal";
import Loading from "../components/Loading";
import { HotTake } from "../types/common";
import dayjs from "dayjs";
import {
  compareRecent,
  compareHottest,
  compareColdest,
  compareTrashest,
} from "../utils/sortUtils";

export type SearchPeriod = "week" | "month" | "year" | "alltime";
export type FilterSort = "recent" | "hottest" | "coldest" | "trashest";

export default function Home() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sortedHotTakes, setSortedHotTakes] = useState<HotTake[]>([]);
  const [period, setPeriod] = useState<SearchPeriod>("week");
  const [sort, setSort] = useState<FilterSort>("recent");
  const { getHotTakes, hotTakes, count, loading, deleteHotTake } = useHotTake();

  let searchPeriod = dayjs().subtract(1, "week").toISOString();
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
    getHotTakes(searchPeriod);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period]);

  useEffect(() => {
    setSortedHotTakes(hotTakes);
  }, [hotTakes]);

  function closeDeleteModal() {
    setSelectedId(null);
  }

  function handleSortChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newSort = e.target.value as FilterSort;

    setSort(newSort);

    if (newSort === "recent") {
      setSortedHotTakes(hotTakes.sort(compareRecent));
    } else if (newSort === "hottest") {
      setSortedHotTakes(hotTakes.sort(compareHottest));
    } else if (newSort === "coldest") {
      setSortedHotTakes(hotTakes.sort(compareColdest));
    } else if (newSort === "trashest") {
      setSortedHotTakes(hotTakes.sort(compareTrashest));
    }
  }

  async function onDeleteClick() {
    if (!selectedId) {
      return;
    }
    await deleteHotTake(selectedId);
  }

  return (
    <>
      <DeleteHotTakeModal
        onDeleteClick={onDeleteClick}
        closeDeleteModal={closeDeleteModal}
      />

      <Layout>
        <div className="max-w-screen-xl w-full flex flex-col items-center">
          <Hero />
          <div className="mt-16 max-w-screen-sm w-full flex flex-col justify-center">
            {loading ? (
              <Loading />
            ) : (
              <>
                <div className="flex mb-4">
                  <div>
                    <select
                      className="select select-primary w-full max-w-xs"
                      value={period}
                      onChange={(e) =>
                        setPeriod(e.target.value as SearchPeriod)
                      }
                    >
                      <option value="week">This week</option>
                      <option value="month">This month</option>
                      <option value="year">This year</option>
                      <option value="alltime">All time</option>
                    </select>
                  </div>
                  <div className="ml-4">
                    <select
                      className="select select-primary w-full max-w-xs"
                      value={sort}
                      onChange={handleSortChange}
                    >
                      <option value="recent">Recently added</option>
                      <option value="hottest">Hottest takes</option>
                      <option value="coldest">Coldest takes</option>
                      <option value="trashest">Trashest takes</option>
                    </select>
                  </div>
                </div>
                {sortedHotTakes.map((hotTake) => (
                  <HotTakeCard
                    key={hotTake.id}
                    hotTake={hotTake}
                    setSelectedId={setSelectedId}
                  />
                ))}
              </>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
}
