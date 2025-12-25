const API_URL = "http://localhost:4000/chat";

export async function sendMessage(
  message: string,
  sessionId?: string
) {
  const res = await fetch(`${API_URL}/message`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message, sessionId }),
  });

  if (!res.ok) {
    throw new Error("Failed to send message");
  }

  return res.json();
}
export async function fetchChatHistory(sessionId: string) {
    const res = await fetch(
      `http://localhost:4000/chat/history/${sessionId}`
    );
  
    if (!res.ok) {
      throw new Error("Failed to fetch chat history");
    }
  
    return res.json();
  }
  
