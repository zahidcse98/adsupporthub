import fs from "fs";
import path from "path";
import { Message } from "@/types";

const DATA_FILE = path.join(process.cwd(), "src", "data", "messages.json");

export function readMessages(): Message[] {
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(raw) as Message[];
}

export function writeMessages(messages: Message[]): void {
  fs.writeFileSync(DATA_FILE, JSON.stringify(messages, null, 2), "utf-8");
}

export function createMessage(data: Omit<Message, "id">): Message {
  const messages = readMessages();
  const maxId = messages.reduce((max, m) => {
    const n = parseInt(m.id, 10);
    return isNaN(n) ? max : Math.max(max, n);
  }, 0);
  const newMessage: Message = { id: String(maxId + 1), ...data };
  writeMessages([...messages, newMessage]);
  return newMessage;
}

export function updateMessage(id: string, data: Partial<Omit<Message, "id">>): Message | null {
  const messages = readMessages();
  const idx = messages.findIndex((m) => m.id === id);
  if (idx === -1) return null;
  messages[idx] = { ...messages[idx], ...data };
  writeMessages(messages);
  return messages[idx];
}

export function deleteMessage(id: string): boolean {
  const messages = readMessages();
  const next = messages.filter((m) => m.id !== id);
  if (next.length === messages.length) return false;
  writeMessages(next);
  return true;
}
