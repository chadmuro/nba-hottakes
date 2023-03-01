import { useState } from "react";
import Layout from "../components/Layout";
import { teams } from "../types/types";

export default function NewPost() {
  return (
    <Layout>
      <form className="w-full flex flex-col items-cente max-w-sm">
        <textarea
          required
          maxLength={180}
          className="textarea textarea-primary w-full mb-4"
          placeholder="Enter your hot take..."
          rows={4}
        ></textarea>
        <select className="select select-primary w-full mb-4">
          <option disabled selected>
            Select a team
          </option>
          {Object.values(teams).map((team) => {
            return <option key={team.id}>{team.full_name}</option>;
          })}
        </select>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </Layout>
  );
}
