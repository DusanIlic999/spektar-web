export const tokenStorage = {
  get: () => sessionStorage.getItem("access_token_spektra"),
  set: (token: string) => sessionStorage.setItem("access_token_spektra", token),
  clear: () => sessionStorage.removeItem("access_token_spektra"),
};
