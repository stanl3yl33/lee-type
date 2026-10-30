CREATE TABLE "test" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"wpm" integer NOT NULL,
	"raw_wpm" integer NOT NULL,
	"accuracy" integer NOT NULL,
	"consistency" real NOT NULL,
	"correct_chars" integer NOT NULL,
	"incorrect_chars" integer NOT NULL,
	"extra_chars" integer NOT NULL,
	"missed_chars" integer NOT NULL,
	"mode" text NOT NULL,
	"test_length" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "test" ADD CONSTRAINT "test_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "test_userId_createdAt_idx" ON "test" USING btree ("user_id","created_at");