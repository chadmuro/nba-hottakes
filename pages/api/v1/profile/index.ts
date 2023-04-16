import type { NextApiRequest, NextApiResponse } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { Database, Json } from "../../../../types/supabase";
import { ResponseData } from "../../../../types/common";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PUT") {
    return res.status(500).json({
      type: "error",
      error: { message: "This method is not available" },
    });
  }

  const supabase = createServerSupabaseClient<Database>({ req, res });

  const body = JSON.parse(req.body);

  const username = body["username"];
  const favorite_team = body["favorite_team"];

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user.id) {
    return res.status(403).json({
      type: "error",
      error: { message: "User is not signed in" },
    });
  }

  const { data, error } = await supabase
    .from("users")
    .update({
      username,
      favorite_team,
    })
    .eq("id", session.user.id)
    .select();

  if (error) {
    res.status(500).json({
      type: "error",
      error: { message: error.message },
    });
  }

  res
    .status(200)
    .json({ type: "success", success: { data: data ? data[0] : null } });
}
