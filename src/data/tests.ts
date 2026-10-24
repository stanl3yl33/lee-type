import "server-only";
import { db } from "@/db/index";
import { test } from "@/db/schema";
import { getSession } from "./auth";
import { and, desc, eq } from "drizzle-orm";
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

// get specific test for view test page
export async function getMyTest(id: string) {
  const session = await getSession();
  if (!session) return null;

  const [row] = await db
    .select({
      id: test.id,
      wpm: test.wpm,
      rawWpm: test.rawWpm,
      accuracy: test.accuracy,
      consistency: test.consistency,
      correctChars: test.correctChars,
      incorrectChars: test.incorrectChars,
      extraChars: test.extraChars,
      missedChars: test.missedChars,
      mode: test.mode,
      testLength: test.testLength,
      durationSeconds: test.durationSeconds,
      wpmHistory: test.wpmHistory,
      createdAt: test.createdAt,
    })
    .from(test)
    .where(and(eq(test.id, id), eq(test.userId, session.user.id)))
    .limit(1);

  return row ?? null;
}
