DROP INDEX "services_slug_unique";--> statement-breakpoint
ALTER TABLE `services` ALTER COLUMN "price_cents" TO "price_cents" integer;--> statement-breakpoint
CREATE UNIQUE INDEX `services_slug_unique` ON `services` (`slug`);