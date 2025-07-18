import Cookies from "js-cookie";

export const USER_TOKEN_KEY = "defaultToken";
export const REFRESH_TOKEN_KEY = "refreshTokenNew";

const isProd =
  (process.env.NEXT_APP_ENV || process.env.NODE_ENV) === "production";

/**
 * Set the userToken cookie.
 *
 * @param value - The cookie's value.
 * @param options - Optional settings for the cookie.
 */
export const setUserTokenCookie = (token: string) => {
  Cookies.set(USER_TOKEN_KEY, token, {
    path: "/",
    secure: isProd,
    sameSite: isProd ? "None" : "Lax",
  });
};

/**
 * Remove the userToken cookie.
 *
 * @param options - Optional settings for removal.
 */
export const removeUserTokenCookie = (
  options?: Cookies.CookieAttributes
): void => {
  Cookies.remove(USER_TOKEN_KEY, options);
  Cookies.remove(REFRESH_TOKEN_KEY, options);
};

/**
 * Get the userToken from cookies.
 *
 * @return The value of the userToken cookie or undefined.
 */
export const getUserTokenCookie = (): string | undefined => {
  return Cookies.get(USER_TOKEN_KEY);
};

/**
 * Set the refresh token cookie.
 */
export const setRefreshTokenCookie = (token: string) => {
  Cookies.set(REFRESH_TOKEN_KEY, token, {
    path: "/",
    secure: isProd,
    sameSite: isProd ? "None" : "Lax",
  });
};

/**
 * Get the refresh token from cookies.
 */
export const getRefreshTokenCookie = (): string | undefined => {
  return Cookies.get(REFRESH_TOKEN_KEY);
};
