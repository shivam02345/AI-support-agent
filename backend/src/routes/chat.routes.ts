import { Router } from "express";
import { generateReply } from "../services/llm.service";
import { db } from "../db";
import { v4 as uuid } from "uuid";

const router = Router();

router.post("/message", async (req, res) => {
    console.log("📩 /chat/message hit", req.body);
  
    const { message, sessionId } = req.body;
    const conversationId = sessionId || uuid();

    if (!message || message.trim() === "") {
        return res.status(400).json({
          error: "Message cannot be empty",
        });
      }
      
      const MAX_LENGTH = 2000;
      
      if (message.length > MAX_LENGTH) {
        return res.status(400).json({
          error: "Message is too long. Please shorten it.",
        });
      }
  
    try {
      console.log("➡️ Creating conversation");
  
      await db.query(
        "INSERT INTO conversations (id) VALUES ($1) ON CONFLICT DO NOTHING",
        [conversationId]
      );
  
      console.log("➡️ Saving user message");
  
      await db.query(
        "INSERT INTO messages VALUES ($1, $2, 'user', $3, NOW())",
        [uuid(), conversationId, message]
      );
  
      console.log("➡️ Fetching history");
  
      const historyRes = await db.query(
        "SELECT text FROM messages WHERE conversation_id=$1 ORDER BY created_at",
        [conversationId]
      );
  
      const history = historyRes.rows.map(r => r.text);
      console.log("📜 History:", history);
  
      console.log("➡️ Calling OpenAI");
  
      const reply = await generateReply(history, message);
      console.log("🤖 AI reply:", reply);
  
      console.log("➡️ Saving AI message");
  
      await db.query(
        "INSERT INTO messages VALUES ($1, $2, 'ai', $3, NOW())",
        [uuid(), conversationId, reply]
      );
  
      console.log("✅ Sending response");
  
      res.json({ reply, sessionId: conversationId });
  
    } catch (err) {
      console.error("❌ CHAT ERROR:", err);
      res.status(500).json({ reply: "Internal server error" });
    }
  });
  
  router.get("/history/:sessionId", async (req, res) => {
    const { sessionId } = req.params;
  
    try {
      const result = await db.query(
        `SELECT sender, text
         FROM messages
         WHERE conversation_id = $1
         ORDER BY created_at ASC`,
        [sessionId]
      );
  
      res.json({
        messages: result.rows,
      });
    } catch (err) {
      console.error("❌ HISTORY ERROR:", err);
      res.status(500).json({
        message: "Failed to load chat history",
      });
    }
  });
  

export default router;
