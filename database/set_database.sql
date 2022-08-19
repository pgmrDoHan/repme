-- MySQL Workbench Synchronization
-- Generated: 2022-08-20 00:19
-- Model: New Model
-- Version: 1.0
-- Project: Name of the project
-- Author: Unknown
SET @OLD_UNIQUE_CHECKS = @@UNIQUE_CHECKS,
  UNIQUE_CHECKS = 0;
SET @OLD_FOREIGN_KEY_CHECKS = @@FOREIGN_KEY_CHECKS,
  FOREIGN_KEY_CHECKS = 0;
SET @OLD_SQL_MODE = @@SQL_MODE,
  SQL_MODE = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';
CREATE TABLE IF NOT EXISTS `repmeDB`.`account` (
  `account_id` INT(18) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(50) NOT NULL,
  `password` CHAR(99) NOT NULL,
  `tos_agreed` TINYINT(4) NOT NULL,
  `account_register_date` DATETIME NOT NULL,
  `password_change_date` TIMESTAMP NOT NULL,
  `ip_address` CHAR(15) NOT NULL,
  `ip_ban` TINYINT(4) NOT NULL,
  PRIMARY KEY (`account_id`),
  UNIQUE INDEX `account_id_UNIQUE` (`account_id` ASC) VISIBLE,
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '\'회원\' 릴레이션';
CREATE TABLE IF NOT EXISTS `repmeDB`.`page` (
  `page_id` INT(18) ZEROFILL UNSIGNED NOT NULL AUTO_INCREMENT,
  `account_id` INT(18) UNSIGNED ZEROFILL NOT NULL,
  `page_content` JSON NOT NULL,
  `notion_url` VARCHAR(300) NOT NULL,
  `page_register_date` DATETIME NOT NULL,
  `page_last_modified` TIMESTAMP NOT NULL,
  PRIMARY KEY (`page_id`),
  UNIQUE INDEX `page_id_UNIQUE` (`page_id` ASC) VISIBLE,
  INDEX `fk_page_account1_idx` (`account_id` ASC) VISIBLE,
  CONSTRAINT `fk_page_account1` FOREIGN KEY (`account_id`) REFERENCES `repmeDB`.`account` (`account_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '\'페이지\' 릴레이션';
CREATE TABLE IF NOT EXISTS `repmeDB`.`extension` (
  `extension_id` INT(18) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT,
  `extension_title` VARCHAR(20) NOT NULL,
  `extension_desc` VARCHAR(5000) NOT NULL,
  `extension_cost` INT(6) UNSIGNED NOT NULL,
  `made_by` VARCHAR(20) NOT NULL,
  `is_registed` TINYINT(4) NOT NULL,
  `extension_register_date` DATETIME NOT NULL,
  PRIMARY KEY (`extension_id`),
  UNIQUE INDEX `extensions_id_UNIQUE` (`extension_id` ASC) VISIBLE,
  UNIQUE INDEX `extension_title_UNIQUE` (`extension_title` ASC) VISIBLE
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
CREATE TABLE IF NOT EXISTS `repmeDB`.`page_extension` (
  `page_id` INT(18) ZEROFILL UNSIGNED NOT NULL,
  `extension_id` INT(18) UNSIGNED ZEROFILL NOT NULL,
  `page_extension_register_date` DATETIME NOT NULL,
  `extension_setting` JSON NOT NULL,
  `extension_setting_last_modified` TIMESTAMP NOT NULL,
  PRIMARY KEY (`page_id`, `extension_id`),
  INDEX `fk_page_extension_extension1_idx` (`extension_id` ASC) VISIBLE,
  CONSTRAINT `fk_page_extensions_page1` FOREIGN KEY (`page_id`) REFERENCES `repmeDB`.`page` (`page_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_page_extension_extension1` FOREIGN KEY (`extension_id`) REFERENCES `repmeDB`.`extension` (`extension_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
CREATE TABLE IF NOT EXISTS `repmeDB`.`page_setting` (
  `page_setting_id` INT(18) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT,
  `page_id` INT(18) ZEROFILL UNSIGNED NOT NULL,
  `page_setting_content` JSON NOT NULL,
  `page_setting_last_modified` TIMESTAMP NOT NULL,
  PRIMARY KEY (`page_setting_id`, `page_id`),
  UNIQUE INDEX `page_setting_id_UNIQUE` (`page_setting_id` ASC) VISIBLE,
  INDEX `fk_page_setting_page1_idx` (`page_id` ASC) VISIBLE,
  CONSTRAINT `fk_page_setting_page1` FOREIGN KEY (`page_id`) REFERENCES `repmeDB`.`page` (`page_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
CREATE TABLE IF NOT EXISTS `repmeDB`.`account_setting` (
  `account_setting_id` INT(18) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT,
  `account_id` INT(18) UNSIGNED ZEROFILL NOT NULL,
  `account_setting_content` JSON NOT NULL,
  `account_setting_last_modified` TIMESTAMP NOT NULL,
  PRIMARY KEY (`account_setting_id`, `account_id`),
  UNIQUE INDEX `account_setting_id_UNIQUE` (`account_setting_id` ASC) VISIBLE,
  INDEX `fk_account_setting_account1_idx` (`account_id` ASC) VISIBLE,
  CONSTRAINT `fk_account_setting_account1` FOREIGN KEY (`account_id`) REFERENCES `repmeDB`.`account` (`account_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
SET SQL_MODE = @OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS = @OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS = @OLD_UNIQUE_CHECKS;