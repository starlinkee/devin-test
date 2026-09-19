export function GET() {
  return Response.json({
    status: "ok",
    env: process.env.VERCEL_ENV ?? process.env.NEXT_PUBLIC_APP_ENV ?? "development",
  });
}
