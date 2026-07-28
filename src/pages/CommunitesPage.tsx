import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import { Spinner } from "../components/Spinner";
import { CommunityCard } from "../components/CommunityCard";
import type { ICommunity } from "../types/community";
import { useNavigate } from "react-router-dom";

export default function CommunitesPage() {
  const navigate = useNavigate();

  const { data, isFetching, isError } = useQuery({
    queryKey: ["communities"],
    queryFn: () => apiClient.get("/communities"),
  });
  
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
      {isFetching ? (
        <Spinner />
      ) : (
        <div className="pt-5 flex flex-wrap justify-center gap-5">
          {data &&
            data.data &&
            data.data.map((item: ICommunity) => (
              <CommunityCard community={item} key={item.id} />
            ))}
        </div>
      )}
    </div>
  );
}
