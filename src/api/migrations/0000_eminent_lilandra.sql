CREATE TABLE `comment` (
	`id` varchar(16) NOT NULL,
	`created_on` datetime(6) NOT NULL DEFAULT now(6),
	`content` text NOT NULL,
	`post_id` varchar(16) NOT NULL,
	`replies_to_comment` varchar(16),
	CONSTRAINT `comment_id` PRIMARY KEY(`id`),
	SORT KEY (`created_on` DESC)
);
--> statement-breakpoint
CREATE TABLE `post` (
	`id` varchar(16) NOT NULL,
	`created_on` datetime(6) NOT NULL DEFAULT now(6),
	`content` text NOT NULL,
	CONSTRAINT `post_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `post` ADD FULLTEXT USING VERSION 2 postFullTextIdx (`content`);
--> statement-breakpoint
ALTER TABLE `comment` ADD FULLTEXT USING VERSION 2 commentFullTextIdx (`content`);
--> statement-breakpoint
CREATE INDEX `post_id_idx` ON `comment` (`post_id`) USING HASH;
