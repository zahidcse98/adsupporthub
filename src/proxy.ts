import { decrypt } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAdminLoginPage = pathname === "/admin/login";
  const isAdminRoute = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");

  if (isAdminRoute || isAdminApi) {
    const token = req.cookies.get("admin_session")?.value;
    const session = await decrypt(token);

    if (!isAdminLoginPage && !session?.username) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    if (isAdminLoginPage && session?.username) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
