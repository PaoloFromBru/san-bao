CREATE TABLE `availability_rules` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`service_id` integer,
	`weekday` integer NOT NULL,
	`start_time` text NOT NULL,
	`end_time` text NOT NULL,
	FOREIGN KEY (`service_id`) REFERENCES `services`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `blocked_dates` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`start_date` text NOT NULL,
	`end_date` text NOT NULL,
	`reason` text
);
--> statement-breakpoint
CREATE TABLE `bookings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`service_id` integer NOT NULL,
	`client_name` text NOT NULL,
	`client_email` text NOT NULL,
	`client_phone` text,
	`starts_at` text NOT NULL,
	`ends_at` text NOT NULL,
	`status` text DEFAULT 'confirmed' NOT NULL,
	`notes` text,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	FOREIGN KEY (`service_id`) REFERENCES `services`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `services` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`duration_minutes` integer NOT NULL,
	`buffer_minutes` integer DEFAULT 0 NOT NULL,
	`price_cents` integer NOT NULL,
	`active` integer DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `services_slug_unique` ON `services` (`slug`);