

create database MYAO;

use MYAO;

drop table if exists `admin`;

/*!40101 set @saved_cs_client     = @@character_set_client */
;

/*!50503 set character_set_client = utf8mb4 */
;

create table `admin`
(
  `admin_id` varchar
(12) not null,
  `type` smallint not null,
  primary key
(`admin_id`)
);

drop table if exists `surfer`;

/*!40101 set @saved_cs_client     = @@character_set_client */
;

/*!50503 set character_set_client = utf8mb4 */
;

create table `surfer`
(
  `id` varchar
(12) not null,
  `fname` varchar
(20) not null,
  `lname` varchar
(20) not null,
  `email` varchar
(50) not null,
  `password` longtext not null,
  `photo` longtext,
  `gender` tinyint
(1) not null,
  `birth_date` date not null,
  `closed_admin` varchar
(12) default null,
  `last_login` timestamp not null,
  `is_active` tinyint
(1) not null DEFAULT 1,
  `created_date` date not null,
  unique
(`email`),
  primary key
(`id`),
  key `fk_surfer_admin`
(`closed_admin`),
  constraint `fk_surfer_admin` foreign key
(`closed_admin`) references `admin`
(`admin_id`)
);

drop table if exists `marketer`;

/*!40101 set @saved_cs_client     = @@character_set_client */
;

/*!50503 set character_set_client = utf8mb4 */
;

create table `marketer`
(
  `id` varchar
(12) not null,
  `fname` varchar
(20) not null,
  `lname` varchar
(20) not null,
  `email` varchar
(50) not null,
  `password` longtext not null,
  `photo` longtext,
  `closed_admin` varchar
(12) default null,
  `is_active` tinyint
(1) not null,
  `last_published` timestamp,
  `founded_at` date not null,
  primary key
(`id`),
  key `fk_marketer_admin`
(`closed_admin`),
  constraint `fk_marketer_admin` foreign key
(`closed_admin`) references `admin`
(`admin_id`)
);

drop table if exists `post`;

/*!40101 set @saved_cs_client     = @@character_set_client */
;

/*!50503 set character_set_client = utf8mb4 */
;

create table `post`
(
  `id` varchar
(12) not null,
  `post_text` longtext not null,
  `surfer_id` varchar
(12) not null,
  `has_multimedia` tinyint
(1) not null default 0,
  `created_date` timestamp not null,
  `comment_counter` int not null DEFAULT 0,
  primary key
(`id`),
  key `fk_post_surfer`
(`surfer_id`),
  constraint `fk_post_surfer` foreign key
(`surfer_id`) references `surfer`
(`id`)
);

drop table if exists `comment`;

/*!40101 set @saved_cs_client     = @@character_set_client */
;

/*!50503 set character_set_client = utf8mb4 */
;

create table `comment`
(
  `post_id` varchar
(12) not null,
  `surfer_id` varchar
(12) not null,
  `content` longtext not null,
  `created_time` timestamp not null,
  `id` varchar
(12) not null,
  primary key
(`id`),
  key `fk_comment_post`
(`post_id`),
  key `fk_comment_surfer`
(`surfer_id`),
  constraint `fk_comment_post` foreign key
(`post_id`) references `post`
(`id`) on
delete cascade,
  constraint `fk_comment_surfer` foreign key
(`surfer_id`) references `surfer`
(`id`) on
delete cascade
);

drop table if exists `favpost`;

/*!40101 set @saved_cs_client     = @@character_set_client */
;

/*!50503 set character_set_client = utf8mb4 */
;

create table `favpost`
(
  `post_id` varchar
(12) not null,
  `surfer_id` varchar
(12) not null,
  primary key
(`post_id`, `surfer_id`),
  key `fk_favpost_surfer`
(`surfer_id`),
  constraint `fk_favpost_post` foreign key
(`post_id`) references `post`
(`id`) on
delete cascade,
  constraint `fk_favpost_surfer` foreign key
(`surfer_id`) references `surfer`
(`id`) on
delete cascade
);

drop table if exists `friend`;

/*!40101 set @saved_cs_client     = @@character_set_client */
;

/*!50503 set character_set_client = utf8mb4 */
;

create table `friend`
(
  `source_id` varchar
(12) not null,
  `target_id` varchar
(12) not null,
  `friendship_time` timestamp,
  `blocked` tinyint
(1) not null default 0,
  primary key
(`source_id`, `target_id`),
  key `fk_friend_surfer1`
(`target_id`),
  constraint `fk_friend_surfer` foreign key
(`source_id`) references `surfer`
(`id`),
  constraint `fk_friend_surfer1` foreign key
(`target_id`) references `surfer`
(`id`) on
delete cascade
);

drop table if exists `like`;

/*!40101 set @saved_cs_client     = @@character_set_client */
;

/*!50503 set character_set_client = utf8mb4 */
;

create table `like`
(
  `type` smallint not null,
  `post_id` varchar
(12) not null,
  `surfer_id` varchar
(12) not null,
  `like_time` timestamp not null,
  primary key
(`post_id`, `surfer_id`),
  constraint `fk_like_post` foreign key
(`post_id`) references `post`
(`id`) on
delete cascade,
  constraint `fk_like_surfer` foreign key
(`surfer_id`) references `surfer`
(`id`) on
delete cascade
);

drop table if exists `share`;

/*!40101 set @saved_cs_client     = @@character_set_client */
;

/*!50503 set character_set_client = utf8mb4 */
;

create table `share`
(
  `post_id` varchar
(12) not null,
  `surfer_id` varchar
(12) not null,
  `share_time` timestamp not null,
  constraint `fk_share_post` foreign key
(`post_id`) references `post`
(`id`) on
delete cascade,
  constraint `fk_share_surfer` foreign key
(`surfer_id`) references `surfer`
(`id`) on
delete cascade
);

drop table if exists `location`;

/*!40101 set @saved_cs_client     = @@character_set_client */
;

/*!50503 set character_set_client = utf8mb4 */
;

create table `location`
(
  `id` varchar
(12) not null,
  `surfer_id` varchar
(12) not null,
  `description` longtext not null,
  `maplink` longtext not null,
  `created_date` timestamp not null,
  primary key
(`id`),
  key `fk_location_surfer`
(`surfer_id`),
  constraint `fk_location_surfer` foreign key
(`surfer_id`) references `surfer`
(`id`) on
delete cascade
);

drop table if exists `mar_rep_mar`;

/*!40101 set @saved_cs_client     = @@character_set_client */
;

/*!50503 set character_set_client = utf8mb4 */
;

create table `mar_rep_mar`
(
  `reported_id` varchar
(12) not null,
  `reporter_id` varchar
(12) not null default '-1',
  `report_option` smallint not null,
  primary key
(`reported_id`, `reporter_id`),
  key `reporter_fk`
(`reporter_id`),
  constraint `reported_fk` foreign key
(`reported_id`) references `marketer`
(`id`) on
delete cascade,
  constraint `reporter_fk` foreign key
(`reporter_id`) references `marketer`
(`id`)
);

drop table if exists `post_media`;

/*!40101 set @saved_cs_client     = @@character_set_client */
;

/*!50503 set character_set_client = utf8mb4 */
;

create table `post_media`
(
  `id` VARCHAR
(12) NOT NULL,
  `link` longtext not null,
  `post_id` varchar
(12) not null,
  `type` tinyint
(1) not null,
  PRIMARY KEY
(`id`),
  key `fk_post_media_post`
(`post_id`),
  constraint `fk_post_media_post` foreign key
(`post_id`) references `post`
(`id`) on
delete cascade
);

drop table if exists `product`;

/*!40101 set @saved_cs_client     = @@character_set_client */
;

/*!50503 set character_set_client = utf8mb4 */
;

create table `product`
(
  `id` varchar
(12) not null,
  `marketer_id` varchar
(12) not null,
  `product_text` longtext not null,
  `avg_rating` decimal
(2, 1) not null DEFAULT 0,
  `price` decimal
(8, 2) not null,
  `created_date` timestamp not null,
  `reviews_counter` int not null DEFAULT 0,
  `product_name` varchar
(20) not null,
  primary key
(`id`),
  constraint `fk_product_marketer` foreign key
(`marketer_id`) references `marketer`
(`id`) on
delete cascade
);

drop table if exists `product_media`;

/*!40101 set @saved_cs_client     = @@character_set_client */
;

/*!50503 set character_set_client = utf8mb4 */
;

create table `product_media`
(
  `id` VARCHAR
(12) NOT NULL,
  `link` longtext not null,
  `product_id` varchar
(12) not null,
  `type` tinyint
(1) not null,
  PRIMARY KEY
(`id`),
  key `fk_product_media_product`
(`product_id`),
  constraint `fk_product_media_product` foreign key
(`product_id`) references `product`
(`id`) on
delete cascade
);

drop table if exists `review`;

/*!40101 set @saved_cs_client     = @@character_set_client */
;

/*!50503 set character_set_client = utf8mb4 */
;

create table `review`
(
  `surfer_id` varchar
(12) not null,
  `product_id` varchar
(12) not null,
  `rating` decimal
(2, 1) not null,
  `created_time` timestamp not null,
  `content` longtext,
  `id` varchar
(12) not null,
  primary key
(`id`),
  key `fk_review_product`
(`product_id`),
  constraint `fk_review_product` foreign key
(`product_id`) references `product`
(`id`) on
delete cascade,
  constraint `fk_review_surfser` foreign key
(`surfer_id`) references `surfer`
(`id`) on
delete cascade
);

drop table if exists `sur_rep_mar`;

/*!40101 set @saved_cs_client     = @@character_set_client */
;

/*!50503 set character_set_client = utf8mb4 */
;

CREATE TABLE `sur_rep_mar`
(
  `reporter_id` varchar
(12) NOT NULL,
  `reported_id` varchar
(12) NOT NULL,
  `report_option` smallint NOT NULL,
  KEY `fk_sur_rep_mar_marketer`
(`reported_id`),
  KEY `fk_sur_rep_mar_surfer`
(`reporter_id`),
  CONSTRAINT `fk_sur_rep_mar_marketer` FOREIGN KEY
(`reported_id`) REFERENCES `marketer`
(`id`) ON
DELETE CASCADE,
  CONSTRAINT `fk_sur_rep_mar_surfer` FOREIGN KEY
(`reporter_id`) REFERENCES `surfer`
(`id`)
);

CREATE TABLE `sur_rep_pos`
(
  `reporter_id` varchar
(12) NOT NULL,
  `reported_id` varchar
(12) NOT NULL,
  `report_option` smallint NOT NULL,
  PRIMARY KEY
(`reporter_id`,`reported_id`),
  KEY `fk_sur_rep_post_post`
(`reported_id`),
  CONSTRAINT `fk_sur_rep_post_post` FOREIGN KEY
(`reported_id`) REFERENCES `post`
(`id`) ON
DELETE CASCADE,
  CONSTRAINT `fk_sur_rep_post_surfer` FOREIGN KEY
(`reporter_id`) REFERENCES `surfer`
(`id`)
);

CREATE TABLE `sur_rep_pro`
(
  `reporter_id` varchar
(12) NOT NULL,
  `reported_id` varchar
(12) NOT NULL,
  `report_option` smallint NOT NULL,
  PRIMARY KEY
(`reporter_id`,`reported_id`),
  KEY `fk_sur_rep_pro_product`
(`reported_id`),
  CONSTRAINT `fk_sur_rep_pro_product` FOREIGN KEY
(`reported_id`) REFERENCES `product`
(`id`) ON
DELETE CASCADE,
  CONSTRAINT `fk_sur_rep_pro_surfer` FOREIGN KEY
(`reporter_id`) REFERENCES `surfer`
(`id`)
);

CREATE TABLE `sur_rep_sur`
(
  `reporter_id` varchar
(12) NOT NULL,
  `reported_id` varchar
(12) NOT NULL,
  `report_option` smallint NOT NULL,
  PRIMARY KEY
(`reporter_id`,`reported_id`),
  KEY `fk_sur_rep_sur_surfer1`
(`reported_id`),
  CONSTRAINT `fk_sur_rep_sur_surfer` FOREIGN KEY
(`reporter_id`) REFERENCES `surfer`
(`id`),
  CONSTRAINT `fk_sur_rep_sur_surfer1` FOREIGN KEY
(`reported_id`) REFERENCES `surfer`
(`id`) ON
DELETE CASCADE
);

ALTER TABLE
  myao.admin
ADD
  COLUMN fname VARCHAR
(20) NOT NULL
AFTER
  type,
ADD
  COLUMN lname VARCHAR
(20) NOT NULL
AFTER
  fname,
ADD
  COLUMN email VARCHAR
(50) NOT NULL
AFTER
  lname,
ADD
  COLUMN password longtext NOT NULL
AFTER
  email,
ADD
  COLUMN photo LONGTEXT NULL DEFAULT NULL
AFTER
  password,
ADD
  COLUMN gender TINYINT
(1) NOT NULL
AFTER
  photo;

ALTER TABLE
  myao.admin
ADD
  COLUMN passwordChangedAt DATE NULL
AFTER
  gender,
ADD
  COLUMN passwordResetToken LONGTEXT NULL
AFTER
  passwordChangedAt,
ADD
  COLUMN passwordResetExpires DATE NULL
AFTER
  passwordResetToken;

ALTER TABLE
  myao.surfer
ADD
  COLUMN passwordChangedAt DATE NULL DEFAULT NULL
AFTER
  created_date,
ADD
  COLUMN passwordResetToken LONGTEXT NULL DEFAULT NULL
AFTER
  passwordChangedAt,
ADD
  COLUMN passwordResetExpires DATE NULL DEFAULT NULL
AFTER
  passwordResetToken;

ALTER TABLE
  myao.marketer
ADD
  COLUMN passwordChangedAt DATE NULL DEFAULT NULL
AFTER
  founded_at,
ADD
  COLUMN passwordResetToken LONGTEXT NULL DEFAULT NULL
AFTER
  passwordChangedAt,
ADD
  COLUMN passwordResetExpires DATE NULL DEFAULT NULL
AFTER
  passwordResetToken;

ALTER TABLE
  myao.surfer
ADD
  COLUMN address VARCHAR
(50) NULL DEFAULT NULL
AFTER
  passwordResetExpires,
ADD
  COLUMN jop VARCHAR
(30) NULL DEFAULT NULL
AFTER
  address,
ADD
  COLUMN education VARCHAR
(30) NULL DEFAULT NULL
AFTER
  jop,
ADD
  COLUMN interests VARCHAR
(50) NULL DEFAULT NULL
AFTER
  education,
ADD
  COLUMN cover_photo LONGTEXT NULL DEFAULT NULL
AFTER
  interests;

ALTER TABLE
  admin CHANGE COLUMN admin_id id VARCHAR
(12) NOT NULL;

ALTER TABLE
  myao.marketer
ADD
  COLUMN cover_photo LONGTEXT NULL DEFAULT NULL
AFTER
  passwordResetExpires;

CREATE DEFINER=`root`@`localhost` PROCEDURE `deactivate_mar`(IN removeIt tinyInt, IN reporter VARCHAR(20) , IN reported VARCHAR(20))
BEGIN 
	IF removeIt = 1
	THEN
		update marketer set is_active = 0 where id = reported;
	END IF;
	delete from sur_rep_mar where reported_id = reported AND reporter_id = reporter;
END

CREATE DEFINER=`root`@`localhost` PROCEDURE `deactivate_pos`(IN removeIt tinyInt, IN reporter VARCHAR(20) , IN reported VARCHAR(20))
BEGIN 
	IF removeIt = 1
	THEN
		delete from post where id = reported;
	END IF;
	delete from sur_rep_pos where reported_id = reported AND reporter_id = reporter;
END

CREATE DEFINER=`root`@`localhost` PROCEDURE `deactivate_pro`(IN removeIt tinyInt, IN reporter VARCHAR(20) , IN reported VARCHAR(20))
BEGIN 
	IF removeIt = 1
	THEN
		delete from product where id = reported;
	END IF;
	delete from sur_rep_pro where reported_id = reported AND reporter_id = reporter;
END

CREATE DEFINER=`root`@`localhost` PROCEDURE `deactivate_sur`(IN removeIt tinyInt, IN reporter VARCHAR(20) , IN reported VARCHAR(20))
BEGIN
	IF removeIt = 1
	THEN
		update surfer set is_active = 0 where id = reported;
	END IF; 
	delete from sur_rep_sur where reported_id = reported AND reporter_id = reporter;
END

CREATE DEFINER=`root`@`localhost` PROCEDURE `fav_post_details`(IN userId varchar(30))
BEGIN
	select post.id as post_id , post.surfer_id as surfer_id ,
	post_text , post.created_date as created_date ,
	comment_counter , fname , lname , photo 
    , count(`like`.post_id) as like_counter
	from favpost
	JOIN post
	  ON favpost.post_id = post.id
	JOIN surfer
	  ON surfer.id = post.surfer_id
	LEFT JOIN `like`
	  ON `like`.post_id = post.id
	where favpost.surfer_id = userId
    group by post.id;
END

CREATE DEFINER=`root`@`localhost` PROCEDURE `insert_comment`(
IN in_post_id varchar(12),
IN in_surfer_id varchar(12),
IN in_content varchar(255),
IN in_created_time timestamp, 
IN in_id varchar(12)
)
BEGIN
	INSERT INTO comment
    (post_id , surfer_id , content , created_time , id) 
    VALUES
    (in_post_id , in_surfer_id , in_content , in_created_time , in_id);
    update post 
    set 
    comment_counter = IFNULL(comment_counter , 0) + 1
    WHERE post.id = in_post_id;
END

use myao;
-- ----------------------------------- triggers ------------------------------------ --
DELIMITER //
CREATE trigger tg_uniqueSurferEmail
before insert ON surfer FOR EACH ROW
BEGIN
	declare msg varchar(100);
    IF NEW.email IN (SELECT email FROM marketer UNION SELECT email FROM admin UNION SELECT email FROM surfer)
    THEN
		set msg = concat('email is used for another user');
        signal sqlstate '45000' set message_text = msg;
    END IF;
END //
CREATE trigger tg_uniqueMarketerEmail
before insert ON marketer FOR EACH ROW
BEGIN
	declare msg varchar(100);
    IF NEW.email IN (SELECT email FROM marketer UNION SELECT email FROM admin UNION SELECT email FROM surfer)
    THEN
		set msg = concat('email is used for another user');
        signal sqlstate '45000' set message_text = msg;
    END IF;
END //
DELIMITER ;

DELIMITER //
CREATE trigger tg_deleteUser
after delete ON surfer 
FOR EACH ROW
begin
  delete from post where surfer_id = OLD.id;
    delete from friend where source_id = OLD.id;
    delete from sur_rep_mar where reporter_id = OLD.id;
    delete from sur_rep_pro where reporter_id = OLD.id;
    delete from sur_rep_pos where reporter_id = OLD.id;
    delete from sur_rep_sur where reporter_id = OLD.id OR reported_id = OLD.id;
end //
DELIMITER;

DELIMITER //
CREATE trigger tg_adminEmail
before insert ON admin FOR EACH ROW
begin
  declare msg varchar(100);
    IF NEW.email IN (SELECT email FROM marketer UNION SELECT email FROM admin UNION SELECT email FROM surfer)
    THEN
    set msg = concat('email is used for another user');
        signal sqlstate '45000' set message_text = msg;
    END IF;
end //
DELIMITER ;
 
 
-- select * from
-- post 
-- JOIN surfer
-- 	ON post.surfer_id = surfer.id
-- LEFT JOIN `like`
-- 	ON post.id = `like`.post_id
-- -- select * from post;
-- -------------------------------- views ------------------------------------ --
-- DROP view IF EXISTS post_all_details;
-- CREATE view post_all_details
-- AS 
-- select 
-- post.* , fname , lname , photo , COUNT(`like`.post_id) as like_counter 
-- from post 
-- JOIN surfer
-- 	ON post.surfer_id = surfer.id
-- LEFT JOIN `like`
-- 	ON `like`.post_id = post.id
-- group by post.id;
--     
-- select * from post_all_details;
-- select post_all_details.* , surfer_id as user_id ;
-- select * from `like`;
-- from post_all_details 
-- where surfer_id = "undefined";
-- select * from `like`;
-- select * from post;
-- select * from post_all_details;
-- --------------------------------stored proc--------------------------------- --
DELIMITER //