import { redirect } from "next/navigation";
import { getSession } from "@/data/auth";
import { getMyTests } from "@/data/tests";

export default async function AccountPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const tests = await getMyTests();

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-accent text-2xl font-medium mb-1">
        {session.user.name}
      </h1>
      <p className="text-untyped text-sm mb-8">recent tests</p>

      {tests.length === 0 ? (
        <p className="text-untyped">
          no tests saved yet. finish a test while signed in and it will show up
          here.
        </p>
      ) : (
        <table className="w-full text-left">
          <thead>
            <tr className="text-untyped text-sm border-b border-untyped/30">
              <th className="py-2 font-normal">date</th>
              <th className="py-2 font-normal">test</th>
              <th className="py-2 font-normal">wpm</th>
              <th className="py-2 font-normal">raw</th>
              <th className="py-2 font-normal">acc</th>
              <th className="py-2 font-normal">consistency</th>
              <th className="py-2 font-normal">time</th>
            </tr>
          </thead>
          <tbody>
            {tests.map((t) => (
              <tr key={t.id} className="border-b border-untyped/10">
                <td className="py-2 text-untyped">
                  {t.createdAt.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </td>
                <td className="py-2 text-correct">
                  {t.mode} {t.testLength}
                </td>
                <td className="py-2 text-accent">{t.wpm}</td>
                <td className="py-2 text-correct">{t.rawWpm}</td>
                <td className="py-2 text-correct">{t.accuracy}%</td>
                <td className="py-2 text-correct">
                  {Math.round(t.consistency)}%
                </td>
                <td className="py-2 text-correct">
                  {/* older rows saved before the column existed hold NULL */}
                  {t.durationSeconds == null
                    ? "—"
                    : `${t.durationSeconds.toFixed(1)}s`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
