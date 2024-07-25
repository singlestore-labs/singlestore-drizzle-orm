ALTER TABLE `users` ADD `name` varchar(256);--> statement-breakpoint
ALTER TABLE `users` ADD `age` bigint;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `full_name`;