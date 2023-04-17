import "../styles/globals.css";
import type { AppProps } from "next/app";
import { useState } from "react";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider, Session } from "@supabase/auth-helpers-react";
import { ReactionProvider } from "../contexts/reactionContext";
import { HotTakeProvider } from "../contexts/hotTakeContext";

export default function App({
  Component,
  pageProps,
}: AppProps<{
  initialSession: Session;
}>) {
  // Create a new supabase browser client on every first render.
  const [supabaseClient] = useState(() => createBrowserSupabaseClient());

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <HotTakeProvider>
        <ReactionProvider>
          <Component {...pageProps} />
        </ReactionProvider>
      </HotTakeProvider>
    </SessionContextProvider>
  );
}
