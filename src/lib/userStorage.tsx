export const userStorage = {
  get: () => sessionStorage.getItem("spektra_username"),
  set: (token: string) => sessionStorage.setItem("spektra_username", token),
  clear: () => sessionStorage.removeItem("spektra_username"),
};
