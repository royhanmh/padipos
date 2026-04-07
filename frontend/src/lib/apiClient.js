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

const buildHeaders = ({ token, headers, body }) => {
  const nextHeaders = new Headers(headers ?? {});

  if (token) {
    nextHeaders.set("Authorization", `Bearer ${token}`);
  }

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

export const requestApi = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? "GET",
    headers: buildHeaders({
      token: options.token,
      headers: options.headers,
      body: options.body,
    }),
    body: buildBody(options.body),
    signal: options.signal,
  });

  const responseBody = await parseResponseBody(response);

  if (!response.ok) {
    const textMessage =
      typeof responseBody === "string" && responseBody.trim()
        ? responseBody.trim()
        : null;
    const message =
      responseBody?.message ??
      responseBody?.error?.message ??
      textMessage ??
      "Request failed.";

    throw new ApiError(message, {
      status: response.status,
      details: responseBody?.errors ?? [],
      data: responseBody,
    });
  }

  return responseBody;
};

export const apiBaseUrl = API_BASE_URL;
