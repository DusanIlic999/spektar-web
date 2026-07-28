import {
  MdOutlineInsertDriveFile,
  MdOutlinePersonOutline,
} from "react-icons/md";
import type { ICommunity } from "../types/community";
import { useNavigate } from "react-router-dom";

interface ICommunityCardProp {
  community: ICommunity;
}

export const CommunityCard = ({ community }: ICommunityCardProp) => {
  const navigate = useNavigate();

  return (
    <div
      className="w-full h-[180px] bg-gray-600/25 rounded-2xl flex gap-5 flex cursor-pointer"
      onClick={() => navigate(`/community/${community.slug}`)}
    >
      <div className="relative w-3/10">
        <img
          src={
            community.coverImageUrl
              ? community.coverImageUrl
              : "/public/placeholder.jpg"
          }
          className="w-full h-full aspect-square object-cover rounded-l-2xl"
        />
        <div className="absolute z-10 bg-gray-600/50 w-full h-full top-0 backdrop-blur-[2px] rounded-l-2xl" />
      </div>
      <div className="pt-2 flex w-7/10 pb-2 capitalize">
        <div className="flex justify-between w-full flex-col">
          <div className="space-y-1 h-full">
            <div className="flex gap-4">
              <h3 className="text-lg font-semibold">{community.name}</h3>
              <div className="flex gap-2">
                <div className="flex items-center gap-1 bg-gray-600/50 px-2 rounded-2xl">
                  <MdOutlinePersonOutline /> 123 Clanova
                </div>
                <div className="flex items-center gap-1 bg-gray-600/50 px-2 rounded-2xl">
                  <MdOutlineInsertDriveFile />
                  300 Objava
                </div>
              </div>
            </div>
            <p className="select-none">{community.description}</p>
          </div>
          <div className="flex w-full justify-between items-center pr-2">
            <button className="px-2 py-1 bg-green-800 rounded-lg cursor-pointer select-none">
              Pridruzi se
            </button>
            <div className="flex gap-3">
              <p className="px-2 py-1 border w-fit rounded-lg bg-green-800 border-green-500">
                {community.type}
              </p>
              <p className="px-2 py-1 border w-fit rounded-lg bg-yellow-800 border-yellow-500">
                {community.category}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
