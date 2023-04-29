import { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import HotTakeCard from "../../components/HotTake/HotTake";
import { useHotTake } from "../../contexts/hotTakeContext";
import DeleteHotTakeModal from "../../components/Modal/DeleteHotTakeModal";
import { GetServerSidePropsContext } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { HotTake } from "../../types/common";

export default function MyReactions({ hotTakes }: { hotTakes: HotTake[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [reactionHotTakes, setReactionHotTakes] = useState(hotTakes);
  const { deleteHotTake } = useHotTake();

  console.log(hotTakes);

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
            {reactionHotTakes.map((hotTake) => (
              <HotTakeCard
                key={hotTake.id}
                hotTake={hotTake}
                setSelectedId={setSelectedId}
              />
            ))}
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

  const { data } = await supabase
    .from("reactions")
    .select(`id, reaction, hottake`)
    .eq("user", session.user.id);

  const reactionIds = data?.map((reaction) => reaction.hottake);

  const { data: hotTakeData } = await supabase
    .from("hottakes")
    .select(
      `id, created_at, message, linked_teams, user(id, username, favorite_team), reactions(id, reaction)`
    )
    .neq("deleted", "1")
    .in("id", reactionIds as string[])
    .order("created_at", { ascending: false });

  console.log(hotTakeData);

  return {
    props: {
      hotTakes: hotTakeData,
    },
  };
};
