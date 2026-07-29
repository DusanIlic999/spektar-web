import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import type { IArrayData } from "../types/api";
import type { ICommunity } from "../types/community";
import type { IUser } from "../types/user";
import { useMemo, useState } from "react";
import { CommunityCard } from "../components/CommunityCard";
import type { IPost } from "../types/post";
import { PostCard } from "../components/PostCard";
import type { UpVotePayload } from "../components/PostList";
import { UserCard } from "../components/UserCard";
import { useDebounce } from "../lib/useDebounce";

type TSearchFilter = "communities" | "posts" | "users";

export default function SearchPage() {
  const [filter, setFilter] = useState<TSearchFilter>("communities");
  const [search, setSearch] = useState<string>("");
  const queryClient = useQueryClient();
  const debounce = useDebounce(search, 600);

  const { data: communities } = useQuery<IArrayData<ICommunity>>({
    queryKey: ["search-communities"],
    queryFn: () => apiClient.get("/communities"),
  });

  const { data: users } = useQuery<IArrayData<IUser>>({
    queryKey: ["search-users"],
    queryFn: () => apiClient.get("/users"),
  });

  const { data: posts } = useQuery<IArrayData<IPost>>({
    queryKey: ["search-posts"],
    queryFn: () => apiClient.get("/posts/public/all"),
  });

  const upVoteMutation = useMutation({
    mutationFn: ({ id }: UpVotePayload) => {
      return apiClient.post(`posts/${id}/vote`, { value: 1 });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["search-posts"] });
    },
  });

  const filteredData = useMemo(() => {
    if (filter === "communities") {
      if (debounce.length > 0) {
        return communities?.data.filter((community: ICommunity) =>
          community.name
            .toLowerCase()
            .trim()
            .includes(debounce?.toLowerCase().trim()),
        );
      } else {
        return communities?.data;
      }
    }
    if (filter === "posts") {
      if (debounce.length > 0) {
        return posts?.data.filter(
          (post: IPost) =>
            post.title
              .toLowerCase()
              .trim()
              .includes(debounce?.toLowerCase().trim()) ||
            post.author.displayName
              .toLowerCase()
              .trim()
              .includes(debounce.toLowerCase().trim()),
        );
      } else {
        return posts?.data;
      }
    }
    if (filter === "users") {
      if (debounce.length > 0) {
        return users?.data.filter((user: IUser) =>
          user.displayName
            .toLowerCase()
            .trim()
            .includes(debounce?.toLowerCase().trim()),
        );
      } else {
        return users?.data;
      }
    }
  }, [debounce, filter]);

  const downVoteMutation = useMutation({
    mutationFn: ({ id }: UpVotePayload) => {
      return apiClient.post(`posts/${id}/vote`, { value: -1 });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["search-posts"] });
    },
  });

  return (
    <div className="w-full text-white h-150 rounded-2xl">
      <input
        type="search"
        placeholder="🔍 Pretrazi postove, korisnike..."
        className="py-3 bg-black/80 rounded-2xl px-5 text-white w-full search-input"
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="mt-5 flex gap-10 bg-black/70 w-full px-5 py-2 rounded-lg">
        <div
          className={`cursor-pointer ${filter === "communities" && `underline underline-offset-2 text-green-500 `}`}
          onClick={() => {
            setFilter("communities");
          }}
        >
          Communities
        </div>

        <div
          className={`cursor-pointer ${filter === "posts" && `underline underline-offset-2 text-green-500 `}`}
          onClick={() => {
            setFilter("posts");
          }}
        >
          Posts
        </div>

        <div
          className={`cursor-pointer ${filter === "users" && `underline underline-offset-2 text-green-500 `}`}
          onClick={() => {
            setFilter("users");
          }}
        >
          Users
        </div>
      </div>
      <div className="mt-5 flex flex-col gap-4 pb-5">
        {filter === "communities" &&
          filteredData?.map((community) => (
            <CommunityCard
              community={community as ICommunity}
              key={community.id}
            />
          ))}

        {filter === "posts" &&
          filteredData?.map((post) => (
            <PostCard
              post={post as IPost}
              key={post.id}
              onUpvote={() => upVoteMutation.mutate({ id: post.id })}
              onDownvote={() => downVoteMutation.mutate({ id: post.id })}
            />
          ))}

        {filter === "users" &&
          filteredData?.map((user) => (
            <UserCard user={user as IUser} key={user.id} />
          ))}
      </div>
    </div>
  );
}
