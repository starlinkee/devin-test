import { auth } from "../auth";
import { SignIn, SignOut } from "./auth-buttons";
import Greeter from "./greeter";

export default async function Home() {
  const env = process.env.NEXT_PUBLIC_APP_ENV ?? process.env.VERCEL_ENV ?? "development";
  const session = await auth();
  const name = session?.user?.name;

  return (
    <main className="card">
      <h1 data-testid="greeting">{name ? `${name}, hello` : "Hello, world"}</h1>
      <p className="env" data-testid="env">
        {env}
      </p>
      <Greeter />
      {session ? <SignOut /> : <SignIn />}
    </main>
  );
}
