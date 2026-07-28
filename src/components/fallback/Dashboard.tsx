import { Filters } from "./Filter";
import { Posts } from "./Posts";
import { Thumbnail } from "./Thumbnail";

export const DashBoard = () => {
  return (
    <div className="w-full text-white space-y-5">
      <Thumbnail />
      <Filters />
      <Posts />
    </div>
  );
};
