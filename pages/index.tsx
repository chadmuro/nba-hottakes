import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import Layout from "../components/Layout";

export default function Home() {
  const session = useSession();
  const supabase = useSupabaseClient();

  console.log(session);

  async function handleSignOut() {
    const { error } = await supabase.auth.signOut();
  }

  return (
    <Layout>
      <h1>Hello world</h1>
    </Layout>
  );
}
