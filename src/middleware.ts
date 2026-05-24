import { NextRequest, NextResponse } from "next/server";

const allowedOrigins = (
  process.env.CORS_ORIGINS || "http://localhost:5173,http://127.0.0.1:5173"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

function getCorsOrigin(req: NextRequest) {
  const origin = req.headers.get("origin");

  if (!origin) return "*";

  if (allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
    return origin;
  }

  return allowedOrigins[0] || origin;
}

function applyCorsHeaders(req: NextRequest, response: NextResponse) {
  const corsOrigin = getCorsOrigin(req);

  response.headers.set("Access-Control-Allow-Origin", corsOrigin);
  response.headers.set("Access-Control-Allow-Credentials", "true");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  return response;
}

const publicRoutes = [
  "/login",
  "/politicas",
  "/politicas/bibliotech",
  "/politicas/churchapp",
  "/politicas/excluir-conta-churchapp",
];

function isPublicRoute(pathname: string) {
  return publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (req.method === "OPTIONS") {
    return applyCorsHeaders(req, new NextResponse(null, { status: 204 }));
  }

  if (pathname.startsWith("/api")) {
    return applyCorsHeaders(req, NextResponse.next());
  }

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/robots.txt") ||
    pathname.startsWith("/sitemap.xml") ||
    pathname.match(/\.(png|jpg|jpeg|gif|webp|svg|ico|css|js|txt|xml)$/)
  ) {
    return NextResponse.next();
  }

  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  const token =
    req.cookies.get("token")?.value ||
    req.cookies.get("session")?.value ||
    req.cookies.get("auth_token")?.value;

  if (!token) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("redirect", pathname);

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};