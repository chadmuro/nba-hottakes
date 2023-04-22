import { useState } from "react";
import Layout from "../components/Layout";
import Hero from "../components/Hero";
import HotTakeCard from "../components/HotTake/HotTake";
import { useHotTake } from "../contexts/hotTakeContext";
import DeleteHotTakeModal from "../components/Modal/DeleteHotTakeModal";

export default function Home() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { hotTakes, count, loading, refreshHotTakes, deleteHotTake } =
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
              <p>Loading...</p>
            ) : (
              <>
                <button
                  className="btn btn-secondary btn-sm mb-4 self-end"
                  onClick={refreshHotTakes}
                >
                  Refresh HotTakes
                </button>
                {hotTakes.map((hotTake) => (
                  <HotTakeCard
                    key={hotTake.id}
                    hotTake={hotTake}
                    setSelectedId={setSelectedId}
                  />
                ))}
                {/* {count !== 0 && count && count > hotTakes.length && (
                  <button className="btn btn-secondary btn-sm self-center">
                    More
                  </button>
                )} */}
              </>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
}
