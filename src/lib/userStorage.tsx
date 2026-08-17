export const userStorage = {
  get: () => {
    const user = sessionStorage.getItem("spektra_username");
    if (user) {
      return JSON.parse(user).username;
    }
    return null;
  },
  set: (token: string) => {
    const ttlMinutes = 15;
    const session = {
      username: token,
      expiresAt: Date.now() + ttlMinutes * 60 * 1000,
    };
    sessionStorage.setItem("spektra_username", JSON.stringify(session));
  },
  clear: () => sessionStorage.removeItem("spektra_username"),
};
