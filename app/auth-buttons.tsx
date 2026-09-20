import { signIn, signOut } from "../auth";

export function SignIn() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("google", { redirectTo: "/" });
      }}
    >
      <button type="submit" data-testid="sign-in">
        Sign in with Google
      </button>
    </form>
  );
}

export function SignOut() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/" });
      }}
    >
      <button type="submit" data-testid="sign-out">
        Sign out
      </button>
    </form>
  );
}
