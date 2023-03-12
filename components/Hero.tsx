import Link from "next/link";
import { useSession } from "@supabase/auth-helpers-react";

export default function Hero() {
  const session = useSession();

  return (
    <div
      className="hero"
      style={{
        backgroundImage: `url("https://images.unsplash.com/photo-1518407613690-d9fc990e795f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2970&q=80")`,
      }}
    >
      <div className="hero-overlay bg-opacity-60"></div>
      <div className="hero-content text-center text-neutral-content py-48">
        <div className="max-w-md prose">
          <h1 className="">NBA Hot Takes</h1>
          <div className="mb-5 text-xl">
            <h3 className="mb-5">Fire takes for the NBA</h3>
            <h4>🔥 = Hot take</h4>
            <h4>❄️ = Cold take</h4>
            <h4>🗑 = Trash</h4>
          </div>
          {session ? (
            <Link href="/new-post" className="btn btn-primary">
              New Post
            </Link>
          ) : (
            <Link href="/signup" className="btn btn-primary">
              Get Started
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
