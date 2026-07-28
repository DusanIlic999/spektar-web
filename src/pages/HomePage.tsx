import { Filters } from "../components/Filters";
import { Posts } from "../components/Posts";
import { Thumbnail } from "../components/Thumbnail";

export default function HomePage() {
  return (
    <div className="w-full text-white space-y-5">
      <Thumbnail />
      <Filters />
      <Posts />
    </div>
  );
}
