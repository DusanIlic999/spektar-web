import { Link, useNavigate } from "react-router-dom";
import { apiClient } from "../api/client";
import type { IArrayData } from "../types/api";
import type { ICommunity } from "../types/community";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useAuthStore } from "../store/authStore";

export const MyCommunity = ({ mobile = false }: { mobile?: boolean }) => {
  const navigate = useNavigate();
  const token = useAuthStore((s) => s.token);

  const { data } = useQuery<IArrayData<ICommunity>>({
    queryKey: ["my-communities"],
    queryFn: () => apiClient.get("/communities/me"),
    enabled: token ? true : false,
  });

  const myCommunities = useMemo(() => {
    return data?.data.slice(0, 5);
  }, [data]);

  return (
    <div className={`text-white ${!mobile && "bg-black/60 rounded-2xl border"} min-w-65  h-fit p-5  border-white/15 text-sm`}>
      <div className="border-b border-white/10 pb-2.5 flex justify-between items-center">
        <div className="font-semibold tracking-wider">Moje zajednice</div>
        <Link
          to={"/create-community"}
          className="text-green-400 cursor-pointer select-none hover:bg-green-400 hover:text-white px-1 rounded-sm"
        >
          +
        </Link>
      </div>
      <div className="flex flex-col gap-2 my-2">
        {myCommunities &&
          myCommunities.map((community: ICommunity) => (
            <div
              key={community.id}
              className="py-1 cursor-pointer"
              onClick={() => {
                navigate(`/community/${community.slug}`);
              }}
            >
              {community.name}
            </div>
          ))}
      </div>
      <Link
        to={"/communities"}
        className="relative top-1 text-green-500 cursor-pointer select-none"
      >
        Istrazi zajednice {`>`}
      </Link>
    </div>
  );
};
