import { useRef } from "react";
import {
  MdOutlineImageSearch,
  MdOutlinePersonOutline,
} from "react-icons/md";
import type { ICommunity } from "../types/community";

interface CommunityHeaderProps {
  community: ICommunity;
  memberCount: number;
  onImageChange: (file: File) => void;
}

export const CommunityHeader = ({
  community,
  memberCount,
  onImageChange,
}: CommunityHeaderProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleIconClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageChange(file);
    }
    e.target.value = "";
  };

  return (
    <div className="w-full flex flex-wrap justify-center gap-5">
      <div className="relative w-full">
        <img
          src={
            community.coverImageUrl
              ? community.coverImageUrl
              : "/public/placeholder.jpg"
          }
          className="w-full max-h-70 rounded-t-2xl"
        />
        <div className="absolute top-2 right-4 w-fit h-fit cursor-pointer">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleChange}
          />
          <MdOutlineImageSearch size={30} onClick={handleIconClick} />
        </div>
        <div className="absolute bottom-0 text-white w-full backdrop-blur-3xl backdrop-brightness-75 px-5 py-1">
          <h3 className="text-2xl font-semibold">{community.name}</h3>
          <div className="flex gap-4">
            <div className="flex gap-2 items-center">
              <MdOutlinePersonOutline />
              {memberCount ? memberCount : "0"} Clanova
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
