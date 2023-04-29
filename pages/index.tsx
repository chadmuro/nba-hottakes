import { useState } from "react";
import Layout from "../components/Layout";
import Hero from "../components/Hero";
import HotTakeCard from "../components/HotTake/HotTake";
import { SearchPeriod, useHotTake } from "../contexts/hotTakeContext";
import DeleteHotTakeModal from "../components/Modal/DeleteHotTakeModal";
import Loading from "../components/Loading";

export default function Home() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { hotTakes, count, loading, deleteHotTake, period, setPeriod } =
    useHotTake();

  function closeDeleteModal() {
    setSelectedId(null);
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
          <div className="mt-16 max-w-screen-sm flex flex-col justify-center">
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
                    <select className="select select-primary w-full max-w-xs">
                      <option>Recently added</option>
                      <option>Hottest takes</option>
                      <option>Coldest takes</option>
                      <option>Trashest takes</option>
                    </select>
                  </div>
                </div>
                {hotTakes.map((hotTake) => (
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
