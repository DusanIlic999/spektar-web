export const userStorage = {
  get: () => localStorage.getItem("spektra_username"),
  set: (token: string) => localStorage.setItem("spektra_username", token),
  clear: () => localStorage.removeItem("spektra_username"),
};
