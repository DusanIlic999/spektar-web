import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import { CommunityCard } from "../components/CommunityCard";
import type { ICommunity } from "../types/community";
import { useNavigate } from "react-router-dom";
import { type IArrayData } from "../types/api";
import { useMemo, useState } from "react";
import { useDebounce } from "../lib/useDebounce";

export default function CommunitesPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState<string>("");
  const debounce = useDebounce(search, 600);

  const { data, isFetching, isError } = useQuery<IArrayData<ICommunity>>({
    queryKey: ["communities"],
    queryFn: () => apiClient.get("/communities"),
  });

  const { data: myCommunities } = useQuery<IArrayData<ICommunity>>({
    queryKey: ["my-communities"],
    queryFn: () => apiClient.get("/communities/me"),
  });

  const isMemberOfCommunity = (currentCommunity: ICommunity) => {
    return myCommunities?.data.some(
      (my: ICommunity) => my.id === currentCommunity.id,
    );
  };

  const filteredCommunities = useMemo(() => {
    if (debounce.length > 0) {
      return data?.data.filter((community: ICommunity) =>
        community.name.toLowerCase().includes(debounce?.toLowerCase().trim()),
      );
    } else {
      return data?.data;
    }
  }, [debounce]);

  if (isError) {
    return (
      <div className="w-full p-5 bg-black/80 space-y-5 text-white rounded-2xl">
        <h3 className="text-2xl font-semibold">Zajednice</h3>
        Neuspelo ucitavanje zajednica...
      </div>
    );
  }

  return (
    <div className="w-full p-5 text-white  bg-black/80 rounded-2xl">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-semibold">Zajednice</h3>
        <button
          className="text-lg font-semibold px-2 py-1 bg-green-800 rounded-lg cursor-pointer"
          onClick={() => navigate("/create-community")}
        >
          Kreiraj zajednicu
        </button>
      </div>
      <div className="my-3 mt-5">
        <input
          className="px-2 py-1 w-full border rounded-md"
          placeholder="Pretrazi zajednice..."
          value={search}
          onChange={(e) => setSearch(e.target.value as string)}
        />
      </div>
      <div className="pt-5 flex flex-wrap justify-center gap-5">
        {filteredCommunities &&
          filteredCommunities.map((item: ICommunity) => {
            console.log(item);
            const isMember = isMemberOfCommunity(item);
            return (
              <CommunityCard
                community={item}
                key={item.id}
                isMember={isMember as boolean}
              />
            );
          })}
      </div>
    </div>
  );
}
