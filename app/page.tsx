import Greeter from "./greeter";

export default function Home() {
  const env = process.env.NEXT_PUBLIC_APP_ENV ?? process.env.VERCEL_ENV ?? "development";

  return (
    <main className="card">
      <h1>Hello, world</h1>
      <p className="env" data-testid="env">
        {env}
      </p>
      <Greeter />
    </main>
  );
}
