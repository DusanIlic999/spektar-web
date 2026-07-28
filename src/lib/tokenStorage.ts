export const tokenStorage = {
  get: () => localStorage.getItem("access_token_spektra"),
  set: (token: string) => localStorage.setItem("access_token_spektra", token),
  clear: () => localStorage.removeItem("access_token_spektra"),
};
