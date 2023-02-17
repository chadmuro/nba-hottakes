import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import Layout from "../components/Layout";
import Hero from "../components/Hero";
import HotTakeCard from "../components/HotTake/card";
import { GetServerSideProps } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../types/supabase";
import { HotTake } from "../types/types";

interface Props {
  data: HotTake[];
}

export default function Home({ data }: Props) {
  console.log(data);
  const session = useSession();
  const supabase = useSupabaseClient();

  return (
    <Layout>
      <Hero />
      {data.map((hotTake) => (
        <HotTakeCard key={hotTake.id} hotTake={hotTake} />
      ))}
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const supabase = createServerSupabaseClient<Database>(context);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { data }: { data: HotTake[] | null } = await supabase
    .from("hottakes")
    .select("*");

  console.log(data);

  return {
    props: {
      data: data ?? [],
    },
  };
};
