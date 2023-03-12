import dayjs from "dayjs";
import Image from "next/image";
import { HotTake } from "../../types/common";
import { teams } from "../../types/teams";

interface Props {
  hotTake: HotTake;
}

export default function HotTakeCard({ hotTake }: Props) {
  return (
    <article className="border border-secondary bg-primary rounded-2xl flex gap-4 p-2">
      <div className="relative">
        <div className="avatar">
          <div className="w-16 rounded-full">
            <Image src="/icons/default_avatar.svg" alt="avatar" fill />
          </div>
        </div>
        <div className="avatar absolute top-10 -right-2 z-10">
          <div className="w-8 bg-white rounded-full">
            <Image
              src={teams[hotTake.user.favorite_team].logo_path}
              alt="team logo"
              fill
              className="p-1"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col flex-1">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="text-primary-content font-bold text-lg leading-5">
              {hotTake.user.username}
            </h4>
            <h5 className="text-xs">
              {dayjs(hotTake.created_at).format("YYYY-MM-DD")}
            </h5>
          </div>
          {hotTake.linked_teams.length > 0 &&
            hotTake.linked_teams.map((team) => (
              <div className="badge" key={team}>
                <Image
                  src={teams[team].logo_path}
                  alt={teams[team].full_name}
                  width={16}
                  height={16}
                  className="mr-1"
                />
                {teams[team].name}
              </div>
            ))}
        </div>
        <p className="text-primary-content">{hotTake.message}</p>
        <div className="flex gap-4 self-end pt-4">
          <span className="bg-accent text-primary-content border border-primary-content rounded-2xl py-1 px-2 cursor-pointer">
            🔥 100
          </span>
          <span className="bg-primary-focus text-primary-content border border-primary-content rounded-2xl py-1 px-2 cursor-pointer">
            ❄️ 100
          </span>
          <span className="bg-primary-focus text-primary-content border border-primary-content rounded-2xl py-1 px-2 cursor-pointer">
            🗑 100
          </span>
        </div>
      </div>
    </article>
  );
}
