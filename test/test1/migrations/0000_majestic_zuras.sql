CREATE TABLE `users` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`name` varchar(256),
	`age` bigint,
	CONSTRAINT `users_id` PRIMARY KEY(`id`)
);
