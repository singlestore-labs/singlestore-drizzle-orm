CREATE TABLE `comment` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`created_on` timestamp(6) NOT NULL DEFAULT now(6),
	`content` varchar(256) NOT NULL,
	`user_id` bigint NOT NULL,
	`post_id` bigint NOT NULL,
	`replies_to_comment` bigint,
	CONSTRAINT `comment_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `post` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`created_on` timestamp(6) NOT NULL DEFAULT now(6),
	`content` varchar(256) NOT NULL,
	`creator_id` bigint NOT NULL,
	CONSTRAINT `post_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`name` varchar(256),
	`email` varchar(256),
	CONSTRAINT `user_id` PRIMARY KEY(`id`)
);
