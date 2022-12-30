import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import Layout from "../components/Layout";
import Hero from "../components/Hero";

export default function Home() {
  const session = useSession();
  const supabase = useSupabaseClient();

  console.log(session);

  return (
    <Layout>
      <Hero />
      <h1>Hello world</h1>
    </Layout>
  );
}
