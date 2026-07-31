import { useNavigate } from "react-router-dom";
import type { IUser } from "../types/user";

export const UserCard = ({ user }: { user: IUser }) => {
  const navigate = useNavigate();

  return (
    <div
      className="w-full bg-black/60 p-3 2xl:p-5 rounded-lg border border-white/15 cursor-pointer"
      onClick={() => navigate(`/profile/${user.username}`)}
    >
      <div className="text-sm mt-1 flex items-center gap-5">
        <img
          src={
            user.avatarUrl ? user.avatarUrl : ""
          }
          className="bg-gray-600 w-8 h-8 rounded-full"
        />
        <div>
          <div>{user.displayName}</div>
          <div>@{user.username}</div>
        </div>
        <div>{user.email}</div>
      </div>
    </div>
  );
};
