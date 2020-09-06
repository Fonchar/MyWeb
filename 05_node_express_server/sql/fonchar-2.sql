use fonchar;

drop tb_article;
CREATE TABLE tb_article
(
  id int PRIMARY KEY auto_increment,
  title varchar(255),
  date date NOT NULL,  
  author varchar(255),
  type_id int NOT NULL default 0,
  tag_id int,
  state int(10) NOT NULL default 0 comment '文章状态 0：草稿，1：发布公开，2：发布私密，3：禁止访问',
  md_id int NOT NULL,
  html_id int NOT NULL
);

-- 目前只采用直接存储的形式
ALTER table tb_article ADD md_url varchar(1000) default NULL comment '文章内容：md地址';
ALTER table tb_article ADD html_url varchar(1000) default NULL comment '文章内容：html地址';

drop tb_article_tags;
CREATE TABLE tb_article_tags
(
  id int PRIMARY KEY auto_increment,
  name varchar(200) NOT NULL
);

INSERT INTO tb_article_tags (name) VALUES ('Vue'),('Node'),('Linux'),('HTML');
INSERT INTO tb_article_tags (name) VALUES ('便签');

drop tb_article_types;
CREATE TABLE tb_article_types
(
  id int PRIMARY KEY auto_increment,
  first_type int default 0 comment '一级分类 0：不分类，1：前端，2：后端，3：随笔',
  second_type int default 0 comment '二级分类 0：不分类，...',
  name varchar(200) NOT NULL
);

INSERT INTO tb_article_types (first_type,second_type,name) VALUES (0,0,'不分类'),(1,0,'前端'),(2,0,'后端'),(3,0,'随笔');

drop tb_article_md;
CREATE TABLE tb_article_md (
  id int PRIMARY KEY auto_increment,
  data varchar(21000) default NULL comment '文章内容：md'
);

drop tb_article_html;
CREATE TABLE tb_article_html (
  id int PRIMARY KEY auto_increment,
  data varchar(21000) default NULL comment '文章内容：html'
);

ALTER TABLE tb_article ADD CONSTRAINT FK_tb_article_tags FOREIGN KEY (tag_id) references tb_article_tags(id);
ALTER TABLE tb_article ADD CONSTRAINT FK_tb_article_types FOREIGN KEY (type_id) references tb_article_types(id);
ALTER TABLE tb_article ADD CONSTRAINT FK_tb_article_md FOREIGN KEY (md_id) references tb_article_md(id);
ALTER TABLE tb_article ADD CONSTRAINT FK_tb_article_html FOREIGN KEY (html_id) references tb_article_html(id);

ALTER table tb_inbound_so_item modify wms_total_cbm_veritable float default 0.00 comment 'WMS 入仓的shipment item 实收 cbm';
ALTER table tb_inbound_so_item modify wms_total_weight_veritable float default 0.00 comment 'WMS 入仓的shipment item 实收 weight';