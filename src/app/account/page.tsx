import { redirect } from "next/navigation";
import { getSession } from "@/data/auth";
import { getMyTests } from "@/data/tests";
import Link from "next/link";

const ROW_GRID =
  "grid grid-cols-[1.4fr_1fr_0.7fr_0.7fr_0.7fr_1fr_0.8fr] gap-4 px-2";

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
        <div>
          {/* header*/}
          <div
            className={`${ROW_GRID} py-2 text-untyped text-sm border-b border-untyped/30`}
          >
            <span>date</span>
            <span>test</span>
            <span>wpm</span>
            <span>raw</span>
            <span>acc</span>
            <span>consistency</span>
            <span>time</span>
          </div>

          <ul>
            {tests.map((t) => (
              <li key={t.id}>
                <Link
                  href={`/account/tests/${t.id}`}
                  className={`group ${ROW_GRID} py-2 border-b border-untyped/10 hover:bg-untyped/15 focus-visible:bg-untyped/15 transition-colors`}
                >
                  <span className="text-untyped group-hover:text-correct transition-colors">
                    {t.createdAt.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <span className="text-correct">
                    {t.mode} {t.testLength}
                  </span>
                  <span className="text-accent">{t.wpm}</span>
                  <span className="text-correct">{t.rawWpm}</span>
                  <span className="text-correct">{t.accuracy}%</span>
                  <span className="text-correct">
                    {Math.round(t.consistency)}%
                  </span>
                  <span className="text-correct">
                    {t.durationSeconds == null
                      ? "—"
                      : `${t.durationSeconds.toFixed(1)}s`}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
