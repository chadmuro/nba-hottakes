import { useState } from "react";
import { GetServerSidePropsContext } from "next";
import Link from "next/link";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import Layout from "../components/Layout";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const session = useSession();
  const supabase = useSupabaseClient();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
  }

  return (
    <Layout>
      <div className="w-full my-auto flex flex-col justify-center items-center pt-16 text-center">
        <h2 className="text-xl">Welcome to NBA Hot Takes 🔥</h2>
        <p>
          Signup today to start posting and reacting to your best NBA Hot Takes!
        </p>
        <form
          className="flex flex-col gap-4 w-full max-w-sm pt-8"
          onSubmit={(e) => handleSubmit(e)}
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input input-bordered input-primary w-full"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input input-bordered input-primary w-full"
          />
          <button type="submit" className="btn btn-primary">
            Signup
          </button>
        </form>
        <p className="pt-8">
          Already have an account?{" "}
          <Link className="link link-primary" href="/login">
            Login
          </Link>
        </p>
      </div>
    </Layout>
  );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const supabase = createServerSupabaseClient(ctx);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
