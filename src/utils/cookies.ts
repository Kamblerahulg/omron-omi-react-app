import Cookies from "js-cookie";

const TOKEN_KEY = "auth_token";

export const setToken = (token: string) => {
  Cookies.set(TOKEN_KEY, token, {
    expires: 1,
    secure: true,
    sameSite: "Strict",
  });
};

export const getToken = () => Cookies.get(TOKEN_KEY);

export const removeToken = () => Cookies.remove(TOKEN_KEY);
