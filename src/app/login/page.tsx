import { redirect } from "next/navigation";
import LoginForm from "@/components/auth/LoginForm";
import { getSession } from "@/data/auth";

export default async function LoginPage() {
  // attach cookie that contains the session
  const session = await getSession();

  if (session) redirect("/"); // redirect to home pg if session exist

  // otherwise display the form
  return <LoginForm />;
}
