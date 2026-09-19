export const API =
  process.env.NEXT_PUBLIC_API_URL || "https://email-automation-ai-agent.onrender.com";

export async function api(
  path: string,
  opts: RequestInit = {}
) {
  const url = `${API}${path}`;

  console.log("➡️ API REQUEST:", url);

  try {
    const response = await fetch(url, {
      ...opts,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(opts.headers || {}),
      },
    });

    console.log("⬅️ API RESPONSE:", response.status, url);

    if (!response.ok) {
      const data = await response
        .json()
        .catch(() => ({
          detail: response.statusText,
        }));

      throw new Error(
        data.detail || `Request failed (${response.status})`
      );
    }

    return response.json();
  } catch (error) {
    console.error("❌ API ERROR:", url, error);
    throw error;
  }
}