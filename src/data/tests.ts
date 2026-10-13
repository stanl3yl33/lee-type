import "server-only";
import { db } from "@/db/index";
import { test } from "@/db/schema";
import { getSession } from "./auth";
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
  });

  return true;
}
