CREATE TABLE `locations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`address` text NOT NULL
);
--> statement-breakpoint
ALTER TABLE `bookings` ADD `location_id` integer REFERENCES locations(id);