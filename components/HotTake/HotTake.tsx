import dayjs from "dayjs";
import Image from "next/image";
import { HotTake, ReactionEnum } from "../../types/common";
import { teams } from "../../types/teams";
import { calculateReactions } from "../../utils/calculateReactions";
import { useReaction } from "../../contexts/reactionContext";
import ReactionButton from "./ReactionButton";
import { useSession } from "@supabase/auth-helpers-react";

interface Props {
  hotTake: HotTake;
  setSelectedId: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function HotTakeCard({ hotTake, setSelectedId }: Props) {
  const session = useSession();
  const { reactions } = useReaction();
  const { fire, cold, trash } = calculateReactions(hotTake.reactions);

  const hotTakeReactions = reactions.filter(
    (reaction) => reaction.hottake === hotTake.id
  );

  return (
    <article className="border border-secondary bg-primary rounded-2xl flex gap-4 p-2 mb-4 w-full">
      <div className="relative flex flex-col justify-between">
        <div className="avatar">
          <div className="w-14 relative">
            {hotTake.user.favorite_team ? (
              <Image
                src={teams[hotTake.user.favorite_team].logo_path}
                alt="avatar"
                fill
                sizes="100%"
              />
            ) : null}
          </div>
        </div>
        {hotTake.user.id === session?.user.id && (
          <label
            htmlFor="delete-hottake-modal"
            className="btn btn-square btn-sm p-1"
            onClick={() => setSelectedId(hotTake.id)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
              />
            </svg>
          </label>
        )}
      </div>
      <div className="flex flex-col flex-1">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="text-primary-content font-bold text-lg leading-5">
              {hotTake.user.username}
            </h4>
            <h5 className="text-xs">
              {dayjs(hotTake.created_at).format("YYYY-MM-DD HH:mm")}
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
          <ReactionButton
            text={`🔥 ${fire}`}
            reaction={ReactionEnum.fire}
            hotTakeId={hotTake.id}
            hotTakeReactions={hotTakeReactions}
          />
          <ReactionButton
            text={`❄️ ${cold}`}
            reaction={ReactionEnum.cold}
            hotTakeId={hotTake.id}
            hotTakeReactions={hotTakeReactions}
          />
          <ReactionButton
            text={`🗑 ${trash}`}
            reaction={ReactionEnum.trash}
            hotTakeId={hotTake.id}
            hotTakeReactions={hotTakeReactions}
          />
        </div>
      </div>
    </article>
  );
}
