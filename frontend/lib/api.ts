export const API = "";

export async function api(
  path: string,
  opts: RequestInit = {}
) {
  const response = await fetch(path, {
    ...opts,
    credentials: "include",

    headers: {
      "Content-Type": "application/json",
      ...(opts.headers || {}),
    },
  });

  if (!response.ok) {
    const data = await response
      .json()
      .catch(() => ({
        detail: response.statusText,
      }));

    throw new Error(
      data.detail ||
        `Request failed (${response.status})`
    );
  }

  return response.json();
}