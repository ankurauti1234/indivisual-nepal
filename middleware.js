import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Allow access to these paths without authentication
  const publicPaths = ["/", "/authentication"];
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  // Check if user is authenticated (client-side check will be enforced too)
  const user = request.cookies.get("user");
  
  if (!user) {
    // Redirect to authentication page if not logged in
    return NextResponse.redirect(new URL("/authentication", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};