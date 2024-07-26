ALTER TABLE `comment` MODIFY COLUMN `created_on` datetime(6) NOT NULL DEFAULT now(6);--> statement-breakpoint
ALTER TABLE `comment` MODIFY COLUMN `content` text NOT NULL;--> statement-breakpoint
ALTER TABLE `post` MODIFY COLUMN `created_on` datetime(6) NOT NULL DEFAULT now(6);--> statement-breakpoint
ALTER TABLE `post` MODIFY COLUMN `content` text NOT NULL;