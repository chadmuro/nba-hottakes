import { useState } from "react";
import { GetServerSidePropsContext } from "next";
import Link from "next/link";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import Layout from "../components/Layout";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const supabase = useSupabaseClient();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_URL}welcome`,
      },
    });

    console.log(data);
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      setIsSuccess(true);
    }
  }

  return (
    <Layout>
      <div className="flex flex-col items-center pt-16 text-center max-w-sm">
        <h2 className="text-xl">Welcome to NBA Hot Takes 🔥</h2>
        <p>
          Signup today to start posting and reacting to your best NBA Hot Takes!
        </p>
        {!!error && (
          <div className="alert alert-error shadow-lg mt-8">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current flex-shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}
        {isSuccess && (
          <div className="alert alert-info shadow-lg mt-8">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="stroke-current flex-shrink-0 w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <span>Please check your email for confirmation</span>
            </div>
          </div>
        )}
        <form
          className="flex flex-col gap-4 w-full pt-8"
          onSubmit={(e) => handleSubmit(e)}
        >
          <input
            required
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input input-bordered input-primary w-full"
          />
          <input
            required
            minLength={6}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input input-bordered input-primary w-full"
          />
          <button type="submit" className="btn btn-primary" disabled={loading}>
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
