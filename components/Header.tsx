import Link from "next/link";
import { useRouter } from "next/router";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";

export default function Header() {
  const session = useSession();
  const supabase = useSupabaseClient();
  const router = useRouter();

  async function handleSignOut() {
    const { error } = await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <div className="navbar bg-base-100">
      <h2 className="flex-1">
        <Link href="/" className="btn btn-ghost normal-case text-xl">
          NBA Hot Takes 🔥
        </Link>
      </h2>
      <div className="dropdown dropdown-end flex-none" tabIndex={0}>
        <button className="btn btn-square btn-ghost">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="inline-block w-5 h-5 stroke-current"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
            ></path>
          </svg>
        </button>
        <ul className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52">
          {session ? (
            <>
              <li>
                <Link href="/profile/hottakes" className="justify-between">
                  Hot Takes
                </Link>
              </li>
              <li>
                <Link href="/profile/reactions" className="justify-between">
                  Reactions
                </Link>
              </li>
              <li>
                <Link href="/new-post" className="justify-between">
                  New Post
                </Link>
              </li>
              <li>
                <Link href="/profile" className="justify-between">
                  Profile
                </Link>
              </li>
              <li>
                <button onClick={handleSignOut}>Sign Out</button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link href="/login">Login</Link>
              </li>
              <li>
                <Link href="/signup">Signup</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}
