export class ApiError extends Error {
  constructor(message, options = {}) {
    super(message);
    this.name = "ApiError";
    this.status = options.status ?? 500;
    this.details = options.details ?? [];
    this.data = options.data ?? null;
  }
}

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";
const FRIENDLY_NETWORK_ERROR_MESSAGE =
  "Unable to reach the server. Please try again in a moment.";
const FRIENDLY_SERVER_ERROR_MESSAGE =
  "Something went wrong on our side. Please try again.";

const isDevelopment = import.meta.env.DEV;

const buildHeaders = ({ headers, body }) => {
  const nextHeaders = new Headers(headers ?? {});

  if (
    body !== undefined &&
    !(body instanceof FormData) &&
    !nextHeaders.has("Content-Type")
  ) {
    nextHeaders.set("Content-Type", "application/json");
  }

  return nextHeaders;
};

const buildBody = (body) => {
  if (body === undefined || body instanceof FormData || typeof body === "string") {
    return body;
  }

  return JSON.stringify(body);
};

const parseResponseBody = async (response) => {
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  if (contentType.startsWith("text/")) {
    return response.text();
  }

  return null;
};

const buildNetworkError = (error) => {
  return new ApiError(
    isDevelopment && error?.message
      ? `${FRIENDLY_NETWORK_ERROR_MESSAGE} (${error.message})`
      : FRIENDLY_NETWORK_ERROR_MESSAGE,
    {
      status: 0,
      details: [],
      data: null,
    },
  );
};

const buildHttpError = (response, responseBody) => {
  const textMessage =
    typeof responseBody === "string" && responseBody.trim()
      ? responseBody.trim()
      : null;
  const status = response.status;
  const isServerError = status >= 500;
  const backendMessage =
    responseBody?.message ?? responseBody?.error?.message ?? textMessage ?? "";

  const message = isServerError
    ? FRIENDLY_SERVER_ERROR_MESSAGE
    : backendMessage || "Request failed.";

  return new ApiError(message, {
    status,
    details: responseBody?.errors ?? [],
    data: isDevelopment ? responseBody : null,
  });
};

export const requestApi = async (path, options = {}) => {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: options.method ?? "GET",
      headers: buildHeaders({
        headers: options.headers,
        body: options.body,
      }),
      body: buildBody(options.body),
      credentials: "include",
      signal: options.signal,
    });
  } catch (error) {
    throw buildNetworkError(error);
  }

  const responseBody = await parseResponseBody(response);

  if (!response.ok) {
    throw buildHttpError(response, responseBody);
  }

  return responseBody;
};

export const apiBaseUrl = API_BASE_URL;
