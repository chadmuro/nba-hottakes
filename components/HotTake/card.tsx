import Image from "next/image";
import { HotTake } from "../../types/types";

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
          <div className="w-8">
            <Image
              src="https://njbaysarqhupdtmikdvd.supabase.co/storage/v1/object/public/logos/DAL_logo.svg"
              alt="team logo"
              fill
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="flex justify-between items-center">
          <h4 className="text-primary-content font-bold text-lg">chadmuro</h4>
          <div className="badge">
            <Image
              src="https://njbaysarqhupdtmikdvd.supabase.co/storage/v1/object/public/logos/DAL_logo.svg"
              alt="team logo"
              width={16}
              height={16}
              className="mr-1"
            />
            Mavericks
          </div>
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
