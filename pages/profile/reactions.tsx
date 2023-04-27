import { useState } from "react";
import Layout from "../../components/Layout";
import HotTakeCard from "../../components/HotTake/HotTake";
import { useHotTake } from "../../contexts/hotTakeContext";
import DeleteHotTakeModal from "../../components/Modal/DeleteHotTakeModal";
import Loading from "../../components/Loading";
import { GetServerSidePropsContext } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useReaction } from "../../contexts/reactionContext";

export default function MyReactions() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { hotTakes, loading, deleteHotTake } = useHotTake();
  const { reactions } = useReaction();

  const hotTakeReactions = reactions.map((reaction) => reaction.hottake);
  // @ts-ignore
  const myReactions = [...new Set(hotTakeReactions)];

  const myHotTakes = hotTakes.filter((hotTake) =>
    myReactions.includes(hotTake.id)
  );

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
        <div className="max-w-screen-xl w-full flex flex-col items-center prose">
          <h1 className="mt-4">My Reactions</h1>
          <div className="max-w-screen-sm flex flex-col justify-center not-prose">
            {loading ? (
              <Loading />
            ) : (
              <>
                {myHotTakes.map((hotTake) => (
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

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const supabase = createServerSupabaseClient(ctx);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
