CREATE TABLE `messages` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`user_id` bigint,
	`message` varchar(256),
	`created_at` datetime,
	CONSTRAINT `messages_id` PRIMARY KEY(`id`)
);
