CREATE TABLE `messages` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`user_id` bigint,
	`message` varchar(256),
	`created_at` datetime,
	CONSTRAINT `messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` text NOT NULL,
	`age` int,
	CONSTRAINT `users_id` PRIMARY KEY(`id`)
);
