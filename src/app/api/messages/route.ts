import { readMessages } from "@/lib/messages.server";
import { NextResponse } from "next/server";

export async function GET() {
  const messages = readMessages();
  return NextResponse.json(messages);
}
