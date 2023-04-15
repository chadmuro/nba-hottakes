import { GetServerSidePropsContext } from "next";
import React, { useState } from "react";
import { useRouter } from "next/router";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import Layout from "../components/Layout";
import { Team, teams } from "../types/teams";

const HOT_TAKE_LENGTH = 180;

export default function NewPost() {
  const router = useRouter();
  const [hotTake, setHotTake] = useState("");
  const [selectedTeam, setSelectedTeam] = useState<Team | "">("");
  const [hotTakeLengthError, setHotTakeLengthError] = useState(false);

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

    const data = {
      message: hotTake,
      linked_team: selectedTeam,
    };

    const response = await fetch("/api/v1/hottake", {
      method: "POST",
      body: JSON.stringify(data),
    });
    const responseData = await response.json();

    if (responseData.type === "success") {
      router.push("/");
    } else {
      // TODO: Display toast
      // console.log(responseData.error.message);
    }
  }

  return (
    <Layout>
      <div className="w-full prose flex flex-col items-center">
        <h1>New Post</h1>
        <form
          className="w-full flex flex-col items-cente max-w-sm"
          onSubmit={onSubmit}
        >
          <textarea
            required
            maxLength={HOT_TAKE_LENGTH}
            className="textarea text-[16px] textarea-primary w-full"
            placeholder="Enter your hot take..."
            rows={5}
            value={hotTake}
            onChange={(e) => onChange(e)}
          ></textarea>
          <label className="label mb-4">
            <span
              className={`label-text-alt ${hotTakeLengthError && "text-error"}`}
            >
              Limit 180 characters
            </span>
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
          <button type="submit" className="btn btn-primary">
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
