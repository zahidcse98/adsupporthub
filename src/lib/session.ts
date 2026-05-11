import { cookies } from "next/headers";
import { decrypt, encrypt, SessionPayload } from "./jwt";

export type { SessionPayload };

const SESSION_COOKIE = "admin_session";

export async function createSession(username: string): Promise<void> {
  const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000);
  const token = await encrypt({ username, expiresAt });
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function verifySession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  return decrypt(token);
}
