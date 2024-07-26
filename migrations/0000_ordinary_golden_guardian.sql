CREATE TABLE `comment` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`created_on` timestamp(6) NOT NULL DEFAULT now(6),
	`content` varchar(256) NOT NULL,
	`post_id` bigint NOT NULL,
	`replies_to_comment` bigint,
	CONSTRAINT `comment_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `post` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`created_on` timestamp(6) NOT NULL DEFAULT now(6),
	`content` varchar(256) NOT NULL,
	CONSTRAINT `post_id` PRIMARY KEY(`id`)
);
