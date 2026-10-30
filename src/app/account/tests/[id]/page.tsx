import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/data/auth";
import { getMyTest } from "@/data/tests";
import { ResultsScreen } from "@/components/typing/ResultScreen";

// reject anything that isn't a UUID before querying:
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function TestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const session = await getSession();
  if (!session) redirect("/login");

  // check if id does not exist, throw notFound()
  if (!UUID_RE.test(id)) notFound();

  //otherwise get row from db and display result page:
  const row = await getMyTest(id);
  if (!row) notFound();

  return (
    <div className="max-w-7xl mx-auto p-8">
      <Link
        href="/account"
        className="text-untyped hover:text-correct transition-colors text-sm"
      >
        ← back to history
      </Link>

      <p className="text-untyped text-sm mt-4 mb-8">
        {row.createdAt.toLocaleString()}
      </p>

      <ResultsScreen
        results={{
          wpm: row.wpm,
          rawWpm: row.rawWpm,
          accuracy: row.accuracy,
          consistency: row.consistency,
          characters: {
            correct: row.correctChars,
            incorrect: row.incorrectChars,
            extra: row.extraChars,
            missed: row.missedChars,
          },
        }}
        mode={row.mode}
        testLength={row.testLength}
        elapsedSeconds={row.durationSeconds}
        wpmHistory={row.wpmHistory ?? []}
      />
    </div>
  );
}
