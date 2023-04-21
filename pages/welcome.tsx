import { useEffect } from "react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import Layout from "../components/Layout";
import useRedirectAfterSomeSeconds from "../hooks/useRedirectAfterSomeSeconds";

export default function Welcome() {
  const supabase = useSupabaseClient();
  const session = useSession();
  const { secondsRemaining } = useRedirectAfterSomeSeconds("/profile", 5);

  useEffect(() => {
    async function createUser(id: string) {
      const { error } = await supabase.from("users").insert({
        id,
      });
      if (error) {
        return;
      }
    }

    if (supabase && session) {
      createUser(session.user.id);
    }
  }, [supabase, session]);

  return (
    <Layout>
      <div className="w-full prose flex flex-col items-center">
        <h1>Thank you for joining NBA Hot Takes!</h1>
        <p>Redirecting in: {secondsRemaining}</p>
      </div>
    </Layout>
  );
}
