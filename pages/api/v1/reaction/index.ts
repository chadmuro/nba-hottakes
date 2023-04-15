import type { NextApiRequest, NextApiResponse } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../../../../types/supabase";
import { ReactionEnum } from "../../../../types/common";

type ApiData = {
  data: {
    created_at: string;
    hottake: string;
    id: string;
    reaction: ReactionEnum;
    user: string;
  } | null;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST" && req.method !== "DELETE") {
    res.status(500).json({
      type: "error",
      error: { message: "This method is not available" },
    });
  }

  const supabase = createServerSupabaseClient<Database>({ req, res });

  const body = JSON.parse(req.body);
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user.id) {
    return res.status(403).json({
      type: "error",
      error: { message: "User is not signed in" },
    });
  }

  if (req.method === "POST") {
    const hottakeId = body["hottake_id"];
    const reaction = body["reaction"];

    const { data, error } = await supabase
      .from("reactions")
      .insert([
        {
          hottake: hottakeId,
          user: session.user.id,
          reaction,
        },
      ])
      .select();

    if (error) {
      return res.status(500).json({
        type: "error",
        error: { message: error.message },
      });
    }

    return res
      .status(200)
      .json({ type: "success", success: { data: data ? data[0] : null } });
  }

  if (req.method === "DELETE") {
    const reaction_id = body["reaction_id"];
  }
}
