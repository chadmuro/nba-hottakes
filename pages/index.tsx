import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import Hero from "../components/Hero";
import HotTakeCard from "../components/HotTake/HotTake";
import {
  FilterSort,
  SearchPeriod,
  useHotTake,
} from "../contexts/hotTakeContext";
import DeleteHotTakeModal from "../components/Modal/DeleteHotTakeModal";
import Loading from "../components/Loading";
import { HotTake, ReactionEnum } from "../types/common";
import dayjs from "dayjs";

function compareHottest(a: HotTake, b: HotTake) {
  return (
    b.reactions.filter((reaction) => reaction.reaction === ReactionEnum.fire)
      .length -
    a.reactions.filter((reaction) => reaction.reaction === ReactionEnum.fire)
      .length
  );
}
function compareColdest(a: HotTake, b: HotTake) {
  return (
    b.reactions.filter((reaction) => reaction.reaction === ReactionEnum.cold)
      .length -
    a.reactions.filter((reaction) => reaction.reaction === ReactionEnum.cold)
      .length
  );
}
function compareTrashest(a: HotTake, b: HotTake) {
  return (
    b.reactions.filter((reaction) => reaction.reaction === ReactionEnum.trash)
      .length -
    a.reactions.filter((reaction) => reaction.reaction === ReactionEnum.trash)
      .length
  );
}
function compareRecent(a: HotTake, b: HotTake) {
  return dayjs(b.created_at).valueOf() - dayjs(a.created_at).valueOf();
}

export default function Home() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sortedHotTakes, setSortedHotTakes] = useState<HotTake[]>([]);
  const {
    hotTakes,
    count,
    loading,
    deleteHotTake,
    period,
    setPeriod,
    sort,
    setSort,
  } = useHotTake();

  // TODO: Move sortedHotTakes into hotTakeContext
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
