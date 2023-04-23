import Link from "next/link";
import { useEffect } from "react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import Lottie from "lottie-react";
import Layout from "../components/Layout";
import flamesAnimation from "../public/lottie/flames.json";
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
      <div className="w-full prose flex flex-col items-center relative">
        <h1 className="mt-20 text-center">
          Thank you for joining NBA Hot Takes!
        </h1>
        <p>Redirecting in: {secondsRemaining}</p>
        <Link href="/profile" className="btn">
          Go to profile page
        </Link>
        <Lottie
          animationData={flamesAnimation}
          loop={true}
          className="w-full absolute bottom-0 -z-10"
        />
      </div>
    </Layout>
  );
}
