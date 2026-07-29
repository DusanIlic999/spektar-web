import type { TPostStatus } from "../pages/HomePage";
import { POSTTYPE, TYPE_LABELS, type TPostTypeFilter } from "../types/post";

export const Filters = ({
  postType,
  setPostType,
  setStatus,
}: {
  postType: TPostTypeFilter;
  setPostType: (type: TPostTypeFilter) => void;
  setStatus: (status: TPostStatus) => void;
}) => {
  return (
    <div className="w-full p-2 rounded-xl bg-black/60 border border-white/15 flex justify-between px-5 items-center">
      <div className="flex gap-1 items-center">
        {(["all", ...Object.values(POSTTYPE)] as TPostTypeFilter[]).map(
          (value) => (
            <div
              className={`cursor-pointer select-none text-gray-400 px-5 py-1 ${postType === value && "bg-green-400/40 rounded-lg text-white"}`}
              onClick={() => setPostType(value)}
            >
              {value === "all" ? "Sve" : TYPE_LABELS[value]}
            </div>
          ),
        )}
      </div>
      <div>
        <select
          className="dd"
          onChange={(e) => {
            setStatus(e.target.value as TPostStatus);
          }}
        >
          <option value="newest">Najnovije</option>
          <option value="tranding">Trending</option>
          <option value="oldest">Najstarije</option>
        </select>
      </div>
    </div>
  );
};
