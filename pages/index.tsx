import { useState } from "react";
import Layout from "../components/Layout";
import Hero from "../components/Hero";
import HotTakeCard from "../components/HotTake/HotTake";
// import { GetServerSideProps } from "next";
// import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
// import { Database } from "../types/supabase";
// import { HotTake } from "../types/common";
import { useHotTake } from "../contexts/hotTakeContext";
import DeleteHotTakeModal from "../components/Modal/DeleteHotTakeModal";

// interface Props {
//   data: HotTake[];
// }

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
                {count !== 0 && count && count > hotTakes.length && (
                  <button className="btn btn-secondary btn-sm self-center">
                    More
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
}

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const supabase = createServerSupabaseClient<Database>(context);

//   const {
//     data: { session },
//   } = await supabase.auth.getSession();

//   const { data } = await supabase
//     .from("hottakes")
//     .select(
//       `id, created_at, message, linked_teams, user(id, username, favorite_team), reactions(id, reaction)`
//     )
//     .neq("deleted", "1")
//     .order("created_at", { ascending: false });

//   console.log(data);

//   return {
//     props: {
//       data: data ?? [],
//     },
//   };
// };
