import type { NextApiRequest, NextApiResponse } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { Database, Json } from "../../../../types/supabase";
import { HotTake } from "../../../../types/common";

type ErrorData = {
  type: "error";
  error: { message: string };
  success?: never;
};

type SuccessData = {
  type: "success";
  error?: never;
  success: {
    data: {
      created_at: string | null;
      deleted: number | null;
      id: string;
      linked_teams: Json;
      message: string | null;
      user: string | null;
    } | null;
  };
};

type ResponseData = ErrorData | SuccessData;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "POST") {
    res.status(500).json({
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

  const { data, error } = await supabase
    .from("hottakes")
    .insert([
      {
        message,
        user: session?.user.id,
        linked_teams: [linked_team],
      },
    ])
    .select();

  res
    .status(200)
    .json({ type: "success", success: { data: data ? data[0] : null } });
}
