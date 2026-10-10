import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import LoginForm from "@/components/auth/LoginForm";

export default async function LoginPage() {
  // attach cookie that contains the session
  const session = await auth.api.getSession({ headers: await headers() });

  if (session) redirect("/"); // redirect to home pg if session exist

  // otherwise display the form
  return <LoginForm />;
}
