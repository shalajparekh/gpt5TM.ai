import { NextResponse } from "next/server";

export const runtime = "edge";

type ChatRequest = {
  sessionId: string;
  messages: Array<{ role: "user" | "assistant" | "system"; content: string }>;
  metadata?: Record<string, unknown>;
};

type N8nResponse = {
  reply: string;
  actions?: Array<{ label: string; value: string }>;
  endConversation?: boolean;
  metadata?: Record<string, unknown>;
};

function pickReply(payload: unknown): string {
  try {
    if (payload == null) return "";
    if (typeof payload === "string") return payload;
    const o = payload as Record<string, unknown>;
    const direct = ["reply", "text", "message", "result", "output", "content", "answer"]
      .map((k) => (o as Record<string, unknown>)?.[k])
      .find((v) => typeof v === "string" && v.trim().length > 0);
    if (typeof direct === "string") return direct;
    const nested = [
      (o as any)?.data,
      (o as any)?.data?.text,
      (o as any)?.data?.reply,
      (o as any)?.response,
      (o as any)?.response?.text,
      (o as any)?.output?.text,
      (o as any)?.choices?.[0]?.message?.content,
      (o as any)?.messages?.[0]?.content,
    ].find((v) => typeof v === "string" && v.trim().length > 0);
    if (typeof nested === "string") return nested;
    return "";
  } catch {
    return "";
  }
}

export async function POST(req: Request) {
  try {
    const body: ChatRequest = await req.json();
    const { sessionId, messages, metadata } = body || {} as ChatRequest;
    if (!sessionId || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const n8nUrl = process.env.N8N_WEBHOOK_URL || "https://neshtechtest.app.n8n.cloud/webhook-test/neshchat";
    const apiKey = process.env.N8N_API_KEY || ""; // optional for test URLs

    const correlationId = crypto.randomUUID();
    async function callWebhook(url: string) {
      const last = messages[messages.length - 1]?.content || "";
      const forwarded = { sessionId, messages, chatInput: last, metadata };
      const r = await fetch(url, {
        method: "POST",
        headers: Object.fromEntries(
          Object.entries({
            "Content-Type": "application/json",
            "x-api-key": apiKey,
            "x-correlation-id": correlationId,
          }).filter(([_, v]) => Boolean(v))
        ),
        body: JSON.stringify(forwarded),
        cache: "no-store",
      });
      // Read as text first, then try JSON; some n8n Respond nodes return text/plain
      const rawText = await r.text();
      let j: Partial<N8nResponse> | { error?: string } = {};
      try { j = rawText ? (JSON.parse(rawText) as Partial<N8nResponse> | { error?: string }) : {}; } catch {}
      return { r, j, rawText };
    }

    const { r: res1, j: data1, rawText: raw1 } = await callWebhook(n8nUrl);
    // If the test URL is used but workflow is not in test mode, n8n returns 404. Try production URL variant automatically.
    if (res1.status === 404 && n8nUrl.includes("/webhook-test/")) {
      const prodUrl = n8nUrl.replace("/webhook-test/", "/webhook/");
      const { r: res2, j: data2, rawText: raw2 } = await callWebhook(prodUrl);
      if (res2.ok) {
        return NextResponse.json({
          reply: pickReply(data2) || (typeof raw2 === "string" ? raw2 : ""),
          actions: (data2 as N8nResponse).actions || [],
          endConversation: Boolean((data2 as N8nResponse).endConversation),
          metadata: (data2 as N8nResponse).metadata || {},
          correlationId,
        });
      }
      const message = (data2 as { error?: string })?.error || `n8n error (${res2.status})`;
      return NextResponse.json({ error: message, correlationId }, { status: res2.status });
    }

    if (!res1.ok) {
      const message = (data1 as { error?: string })?.error || `n8n error (${res1.status})`;
      return NextResponse.json({ error: message, correlationId }, { status: res1.status });
    }

    return NextResponse.json({
      reply: pickReply(data1) || (typeof raw1 === "string" ? raw1 : ""),
      actions: (data1 as N8nResponse).actions || [],
      endConversation: Boolean((data1 as N8nResponse).endConversation),
      metadata: (data1 as N8nResponse).metadata || {},
      correlationId,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


