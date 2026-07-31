import { useState } from "react";
import { Filters } from "../components/Filters";
import { Posts } from "../components/Posts";
import { Thumbnail } from "../components/Thumbnail";
import { type TPostTypeFilter } from "../types/post";

export type TPostStatus = "newest" | "tranding" | "oldest";

export default function HomePage() {
  const [postType, setPostType] = useState<TPostTypeFilter>("all");
  const [postStatus, setStatus] = useState<TPostStatus>("newest");

  return (
    <div className="w-full text-white space-y-5 2xl:px-0">
      <Thumbnail />
      <Filters
        postType={postType}
        setPostType={(type: TPostTypeFilter) => setPostType(type)}
        setStatus={(status: TPostStatus) => setStatus(status)}
      />
      <Posts postType={postType} postStatus={postStatus}/>
    </div>
  );
}
