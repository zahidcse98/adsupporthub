import { deleteMessage, updateMessage } from "@/lib/messages.server";
import { verifySession } from "@/lib/session";
import { Message } from "@/types";
import { NextRequest, NextResponse } from "next/server";

async function guardAdmin() {
  const session = await verifySession();
  if (!session?.username) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return null;
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await guardAdmin();
  if (denied) return denied;

  const { id } = await params;
  const body = await req.json();
  const { title, body: msgBody, category, tags, keywords } = body as Partial<Omit<Message, "id">>;

  const updated = updateMessage(id, {
    ...(title !== undefined && { title: title.trim() }),
    ...(msgBody !== undefined && { body: msgBody.trim() }),
    ...(category !== undefined && { category: category.trim() }),
    ...(tags !== undefined && { tags: tags.map((t) => t.trim()).filter(Boolean) }),
    ...(keywords !== undefined && { keywords: keywords.map((k) => k.trim()).filter(Boolean) }),
  });

  if (!updated) return NextResponse.json({ error: "Message not found" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await guardAdmin();
  if (denied) return denied;

  const { id } = await params;
  const deleted = deleteMessage(id);
  if (!deleted) return NextResponse.json({ error: "Message not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}
