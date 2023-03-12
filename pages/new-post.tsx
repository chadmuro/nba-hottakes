import React, { useState } from "react";
import Layout from "../components/Layout";
import { Team, teams } from "../types/teams";

const HOT_TAKE_LENGTH = 180;

export default function NewPost() {
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

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log(hotTake, selectedTeam);
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
            className="textarea textarea-primary w-full"
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
