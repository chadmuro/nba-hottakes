import { useState } from "react";
import { GetServerSidePropsContext } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import Layout from "../components/Layout";
import { Team, teams } from "../types/teams";
import { User } from "../types/common";

interface Props {
  data: User;
}

export default function Profile({ data }: Props) {
  const [username, setUsername] = useState(data.username);
  const [selectedTeam, setSelectedTeam] = useState<Team | "">(
    data.favorite_team
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const data = {
      username,
      favorite_team: selectedTeam,
    };

    const response = await fetch("api/v1/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (responseData.type === "success") {
      console.log(responseData);
      // router.push("/");
    } else {
      // TODO: Display toast
      // console.log(responseData.error.message);
    }
  }

  function onSelect(e: React.ChangeEvent<HTMLSelectElement>) {
    setSelectedTeam(parseInt(e.target.value, 10) as Team);
  }

  return (
    <Layout>
      <div className="w-full prose flex flex-col items-center">
        <h1>Profile</h1>
        <form
          className="w-full flex flex-col items-cente max-w-sm gap-4"
          onSubmit={onSubmit}
        >
          <input
            required
            type="username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input input-bordered input-primary w-full"
          />
          <select
            required
            className="select select-primary w-full"
            value={selectedTeam}
            onChange={(e) => onSelect(e)}
          >
            <option disabled value="">
              Favorite team
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

  const { data } = await supabase
    .from("users")
    .select(`id, username, favorite_team`)
    .eq("id", session?.user.id);

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      data: data
        ? data[0]
        : {
            id: "",
            username: "",
            favorite_team: "",
          },
    },
  };
};
