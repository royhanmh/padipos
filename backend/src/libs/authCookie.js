const AUTH_COOKIE_NAME =
  process.env.AUTH_COOKIE_NAME?.trim() || "pos_sederhana_auth";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h";
const NODE_ENV = process.env.NODE_ENV || "development";
const isProduction = NODE_ENV === "production";

const parseDurationToMs = (value) => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  const normalizedValue = String(value).trim();

  if (/^\d+$/.test(normalizedValue)) {
    return Number(normalizedValue);
  }

  const match = normalizedValue.match(/^(\d+)\s*(ms|s|m|h|d)$/i);

  if (!match) {
    return 24 * 60 * 60 * 1000;
  }

  const amount = Number(match[1]);
  const unit = match[2].toLowerCase();

  const multipliers = {
    ms: 1,
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };

  return amount * multipliers[unit];
};

const maxAge = parseDurationToMs(JWT_EXPIRES_IN);
const secure =
  process.env.AUTH_COOKIE_SECURE === "true" ||
  (process.env.AUTH_COOKIE_SECURE !== "false" && isProduction);
const sameSite =
  process.env.AUTH_COOKIE_SAME_SITE?.trim() || (secure ? "none" : "lax");

export const authCookieName = AUTH_COOKIE_NAME;
export const authCookieMaxAge = maxAge;

export const getAuthCookieOptions = () => ({
  httpOnly: true,
  secure,
  sameSite,
  path: "/",
  maxAge,
});

export const setAuthCookie = (res, token) => {
  res.cookie(AUTH_COOKIE_NAME, token, getAuthCookieOptions());
};

export const clearAuthCookie = (res) => {
  const { maxAge: _maxAge, ...cookieOptions } = getAuthCookieOptions();
  res.clearCookie(AUTH_COOKIE_NAME, cookieOptions);
};

export const getAuthTokenFromRequest = (req) => {
  const cookieHeader = req.headers.cookie;

  if (!cookieHeader) {
    return null;
  }

  const cookie = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${AUTH_COOKIE_NAME}=`));

  if (!cookie) {
    return null;
  }

  return decodeURIComponent(cookie.slice(AUTH_COOKIE_NAME.length + 1));
};
