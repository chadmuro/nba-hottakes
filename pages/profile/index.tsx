import { useState } from "react";
import { GetServerSidePropsContext } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { toast } from "react-hot-toast";
import Layout from "../../components/Layout";
import { Team, teams } from "../../types/teams";
import { ResponseData, User } from "../../types/common";
import { useHotTake } from "../../contexts/hotTakeContext";

interface Props {
  data: User;
}

export default function Profile({ data }: Props) {
  const [updating, setUpdating] = useState(false);
  const [username, setUsername] = useState(data.username);
  const [selectedTeam, setSelectedTeam] = useState<Team | "">(
    data.favorite_team ?? ""
  );
  const { refreshHotTakes } = useHotTake();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    setUpdating(true);
    e.preventDefault();

    const data = {
      username,
      favorite_team: selectedTeam,
    };

    const response = await fetch("api/v1/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });

    const responseData: ResponseData<User> = await response.json();

    if (responseData.type === "success") {
      refreshHotTakes();
      toast.success("Profile updated!");
    } else {
      toast.error(responseData.error.message);
    }

    setUpdating(false);
  }

  function onSelect(e: React.ChangeEvent<HTMLSelectElement>) {
    setSelectedTeam(parseInt(e.target.value, 10) as Team);
  }

  return (
    <Layout>
      <div className="w-full prose flex flex-col items-center">
        <h1 className="mt-4">Profile</h1>
        <form
          className="w-full flex flex-col items-cente max-w-sm gap-4"
          onSubmit={onSubmit}
        >
          <div>
            <label className="label">
              <span className="label-text">Username</span>
            </label>
            <input
              required
              type="username"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input input-bordered input-primary w-full"
            />
          </div>
          <div>
            <label className="label">
              <span className="label-text">Choose your favorite team</span>
            </label>
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
          </div>
          <button type="submit" className="btn btn-primary" disabled={updating}>
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
