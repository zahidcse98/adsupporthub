import { createMessage, readMessages } from "@/lib/messages.server";
import { verifySession } from "@/lib/session";
import { Message } from "@/types";
import { NextRequest, NextResponse } from "next/server";

async function guardAdmin() {
  const session = await verifySession();
  if (!session?.username) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return null;
}

export async function GET() {
  const denied = await guardAdmin();
  if (denied) return denied;
  return NextResponse.json(readMessages());
}

export async function POST(req: NextRequest) {
  const denied = await guardAdmin();
  if (denied) return denied;

  const body = await req.json();
  const { title, body: msgBody, category, tags, keywords } = body as Omit<Message, "id">;

  if (!title || !msgBody || !category) {
    return NextResponse.json({ error: "title, body, and category are required" }, { status: 400 });
  }

  const message = createMessage({
    title: title.trim(),
    body: msgBody.trim(),
    category: category.trim(),
    tags: Array.isArray(tags) ? tags.map((t: string) => t.trim()).filter(Boolean) : [],
    keywords: Array.isArray(keywords) ? keywords.map((k: string) => k.trim()).filter(Boolean) : [],
  });

  return NextResponse.json(message, { status: 201 });
}
