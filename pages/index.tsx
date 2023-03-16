import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import Layout from "../components/Layout";
import Hero from "../components/Hero";
import HotTakeCard from "../components/HotTake/card";
import { GetServerSideProps } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../types/supabase";
import { HotTake } from "../types/common";

interface Props {
  data: HotTake[];
}

export default function Home({ data }: Props) {
  console.log(data);
  const session = useSession();
  const supabase = useSupabaseClient();

  return (
    <Layout>
      <div className="max-w-screen-xl w-full flex flex-col items-center">
        <Hero />
        <div className="max-w-screen-sm">
          {data.map((hotTake) => (
            <HotTakeCard key={hotTake.id} hotTake={hotTake} />
          ))}
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const supabase = createServerSupabaseClient<Database>(context);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { data } = await supabase
    .from("hottakes")
    .select(
      `id, created_at, message, linked_teams, user(id, username, favorite_team)`
    )
    .neq("deleted", "1")
    .order("created_at", { ascending: false });

  console.log(data);

  return {
    props: {
      data: data ?? [],
    },
  };
};
