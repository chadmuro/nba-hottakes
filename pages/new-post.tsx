import { GetServerSidePropsContext } from "next";
import React, { useState } from "react";
import { useRouter } from "next/router";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { toast } from "react-hot-toast";
import Layout from "../components/Layout";
import { Team, teams } from "../types/teams";
import { HotTake, ResponseData } from "../types/common";

const HOT_TAKE_LENGTH = 180;

export default function NewPost() {
  const router = useRouter();
  const [hotTake, setHotTake] = useState("");
  const [selectedTeam, setSelectedTeam] = useState<Team | "">("");
  const [hotTakeLengthError, setHotTakeLengthError] = useState(false);
  const [posting, setPosting] = useState(false);

  function onChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setHotTake(e.target.value);
    if (e.target.value.length >= HOT_TAKE_LENGTH) {
      setHotTakeLengthError(true);
    } else {
      setHotTakeLengthError(false);
    }
  }

  function onSelect(e: React.ChangeEvent<HTMLSelectElement>) {
    setSelectedTeam(parseInt(e.target.value, 10) as Team);
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPosting(true);

    const data = {
      message: hotTake,
      linked_team: selectedTeam,
    };

    const response = await fetch("/api/v1/hottake", {
      method: "POST",
      body: JSON.stringify(data),
    });
    const responseData: ResponseData<HotTake> = await response.json();

    if (responseData.type === "success") {
      toast.success("New hot take added!");
      router.push("/");
    } else {
      toast.error(responseData.error.message);
    }
    setPosting(false);
  }

  return (
    <Layout>
      <div className="w-full prose flex flex-col items-center">
        <h1 className="mt-4">New Post</h1>
        <form
          className="w-full flex flex-col items-cente max-w-sm gap-4"
          onSubmit={onSubmit}
        >
          <div>
            <textarea
              required
              maxLength={HOT_TAKE_LENGTH}
              className="textarea text-[16px] textarea-primary w-full"
              placeholder="Enter your hot take..."
              rows={5}
              value={hotTake}
              onChange={(e) => onChange(e)}
            ></textarea>
            <label className="label">
              <span
                className={`label-text-alt ${
                  hotTakeLengthError && "text-error"
                }`}
              >
                Limit 180 characters
              </span>
            </label>
          </div>
          <div>
            <label className="label">
              <span className="label-text">Link a team</span>
            </label>
            <select
              required
              className="select select-primary w-full mb-4"
              value={selectedTeam}
              onChange={(e) => onSelect(e)}
            >
              <option disabled value="">
                Select a team
              </option>
              {Object.values(teams).map((team) => {
                return (
                  <option key={team.id} value={team.id}>
                    {team.full_name}
                  </option>
                );
              })}
            </select>
          </div>
          <button type="submit" className="btn btn-primary" disabled={posting}>
            Submit
          </button>
        </form>
      </div>
    </Layout>
  );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const supabase = createServerSupabaseClient(ctx);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
