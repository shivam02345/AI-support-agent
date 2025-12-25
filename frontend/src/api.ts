const API_BASE = import.meta.env.VITE_API_BASE_URL;

export async function sendMessage(message: string, sessionId?: string) {
  const res = await fetch(`${API_BASE}/chat/message`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, sessionId }),
  });

  if (!res.ok) {
    throw new Error("API request failed");
  }

  return res.json();
}

export async function fetchChatHistory(sessionId: string) {
  const res = await fetch(`${API_BASE}/chat/history/${sessionId}`);
  if (!res.ok) throw new Error("History fetch failed");
  return res.json();
}
