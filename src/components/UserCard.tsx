import type { IUser } from "../types/user";

export const UserCard = ({ user }: { user: IUser }) => {
  return <div>{user.displayName}</div>;
};
