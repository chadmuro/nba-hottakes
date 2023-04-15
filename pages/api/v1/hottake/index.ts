import type { NextApiRequest, NextApiResponse } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { Database, Json } from "../../../../types/supabase";
import { ResponseData } from "../../../../types/common";

type ApiData = {
  data: {
    created_at: string | null;
    deleted: number | null;
    id: string;
    linked_teams: Json;
    message: string | null;
    user: string | null;
  } | null;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData<ApiData>>
) {
  if (req.method !== "POST") {
    return res.status(500).json({
      type: "error",
      error: { message: "This method is not available" },
    });
  }

  const supabase = createServerSupabaseClient<Database>({ req, res });

  const body = JSON.parse(req.body);

  const message = body["message"];
  const linked_team = body["linked_team"];

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
    .from("hottakes")
    .insert([
      {
        message,
        user: session.user.id,
        linked_teams: [linked_team],
      },
    ])
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
