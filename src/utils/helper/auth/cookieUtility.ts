import Cookies from "js-cookie";

export const USER_TOKEN_KEY = "defaultToken";
export const REFRESH_TOKEN_KEY = "refreshToken";

/**
 * Set the userToken cookie.
 *
 * @param value - The cookie's value.
 * @param options - Optional settings for the cookie.
 */
export const setUserTokenCookie = (
  value: string,
  options?: Cookies.CookieAttributes
): void => {
  Cookies.set(USER_TOKEN_KEY, value, {
    ...options,
    secure: process.env.NEXT_APP_ENV === "production", // Ensure secure transmission in production
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
  Cookies.remove(REFRESH_TOKEN_KEY);
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
export const setRefreshTokenCookie = (refreshToken: string): void => {
  Cookies.set(REFRESH_TOKEN_KEY, refreshToken, {
    secure: process.env.NEXT_APP_ENV === "production",
    sameSite: "none",
    path: "/",
  });
};

/**
 * Get the refresh token from cookies.
 */
export const getRefreshTokenCookie = (): string | undefined => {
  return Cookies.get(REFRESH_TOKEN_KEY);
};
