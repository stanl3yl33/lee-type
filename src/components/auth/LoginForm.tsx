"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function LoginForm() {
  const router = useRouter();

  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsPending(true);

    // signup or sign in auth fn depending on state
    const { error: authError } = isSignUp
      ? await authClient.signUp.email({ name, email, password })
      : await authClient.signIn.email({ email, password });

    setIsPending(false);

    // error case:
    if (authError) {
      setError(authError.message ?? "Error - something went wrong");
      return;
    }
    // redirect user to main pg on successful signup / signin
    router.push("/");
    router.refresh();
  };

  const inputClass =
    "bg-transparent border border-untyped/40 rounded px-3 py-2 text-correct placeholder:text-untyped/60 focus:outline-none focus:border-accent";

  return (
    <div className="max-w-sm mx-auto p-8">
      <h1 className="text-accent text-2xl font-medium mb-6">
        {isSignUp ? "sign up" : "sign in"}
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {isSignUp && (
          <input
            type="text"
            placeholder="username"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
            required
          />
        )}
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
          required
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputClass}
          required
        />

        {error && <p className="text-incorrect text-sm">{error}</p>}

        <button
          type="submit"
          disabled={isPending}
          className="text-accent border border-accent rounded px-3 py-2 hover:bg-accent hover:text-background transition-colors disabled:opacity-50"
        >
          {isPending ? "..." : isSignUp ? "sign up" : "sign in"}
        </button>
      </form>

      <button
        type="button"
        onClick={() => {
          setIsSignUp((prev) => !prev);
          setError(null);
        }}
        className="text-untyped hover:text-correct text-sm mt-4"
      >
        {isSignUp ? "have an account? sign in" : "no account? sign up"}
      </button>
    </div>
  );
}
