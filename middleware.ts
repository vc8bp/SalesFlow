import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAdmin = token?.isAdmin;
    const isManager = token?.isManager
    const pathname = req.nextUrl.pathname;

    if (pathname.startsWith("/admin") && !isAdmin) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    if (isManager && pathname !== "/orders" && !pathname.startsWith("/orders")) {
      return NextResponse.redirect(new URL("/orders", req.url));
    }
    
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/",
    "/admin/:path*",
    "/orders/:path*",
    "/products/:path*",
  ],
};