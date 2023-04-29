import { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import HotTakeCard from "../../components/HotTake/HotTake";
import { useHotTake } from "../../contexts/hotTakeContext";
import DeleteHotTakeModal from "../../components/Modal/DeleteHotTakeModal";
import { GetServerSidePropsContext } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useSession } from "@supabase/auth-helpers-react";
import Loading from "../../components/Loading";

export default function MyReactions() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { deleteHotTake, getMyReactions, hotTakes, loading } = useHotTake();
  const session = useSession();

  useEffect(() => {
    if (session) {
      getMyReactions(session?.user.id);
    }
    // TODO: Update useEffect dependencies
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

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
          <div className="max-w-screen-sm w-full flex flex-col justify-center not-prose">
            {loading ? (
              <Loading />
            ) : (
              <>
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
