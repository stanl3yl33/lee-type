import "server-only";
import { db } from "@/db/index";
import { test } from "@/db/schema";
import { getSession } from "./auth";
import { desc, eq } from "drizzle-orm";
export type SaveTestInput = Omit<
  typeof test.$inferInsert,
  "id" | "userId" | "createdAt"
>;

export async function saveTest(input: SaveTestInput): Promise<boolean> {
  const session = await getSession();
  if (!session) return false;

  await db.insert(test).values({
    userId: session.user.id,
    wpm: input.wpm,
    rawWpm: input.rawWpm,
    accuracy: input.accuracy,
    consistency: input.consistency,
    correctChars: input.correctChars,
    incorrectChars: input.incorrectChars,
    extraChars: input.extraChars,
    missedChars: input.missedChars,
    mode: input.mode,
    testLength: input.testLength,
    durationSeconds: input.durationSeconds,
    wpmHistory: input.wpmHistory ?? null,
  });

  return true;
}

// get the 50 most recent tests for the signed-in user
export async function getMyTests() {
  const session = await getSession();
  if (!session) return [];

  return db
    .select({
      id: test.id,
      wpm: test.wpm,
      rawWpm: test.rawWpm,
      accuracy: test.accuracy,
      consistency: test.consistency,
      mode: test.mode,
      testLength: test.testLength,
      durationSeconds: test.durationSeconds,
      createdAt: test.createdAt,
    })
    .from(test)
    .where(eq(test.userId, session.user.id))
    .orderBy(desc(test.createdAt))
    .limit(50);
}
