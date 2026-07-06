-- ============================================
-- 个人博客系统 - 数据库初始化脚本
-- 技术栈：React + Servlet + MySQL
-- ============================================

-- 1. 创建数据库
CREATE DATABASE IF NOT EXISTS blog_system
    DEFAULT CHARACTER SET utf8mb4
    DEFAULT COLLATE utf8mb4_unicode_ci;

USE blog_system;

-- ============================================
-- 2. 创建表
-- ============================================

-- 2.1 用户表
CREATE TABLE IF NOT EXISTS users (
    id          INT             PRIMARY KEY AUTO_INCREMENT  COMMENT '主键',
    username    VARCHAR(50)     UNIQUE NOT NULL             COMMENT '用户名',
    password    VARCHAR(255)    NOT NULL                    COMMENT '密码（MD5加密）',
    email       VARCHAR(100)    DEFAULT ''                  COMMENT '邮箱',
    avatar      VARCHAR(255)    DEFAULT ''                  COMMENT '头像URL',
    role        ENUM('admin','user') DEFAULT 'user'         COMMENT '角色：admin管理员/user普通用户',
    created_at  DATETIME        DEFAULT CURRENT_TIMESTAMP   COMMENT '注册时间',
    updated_at  DATETIME        DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- 2.2 分类表
CREATE TABLE IF NOT EXISTS categories (
    id          INT             PRIMARY KEY AUTO_INCREMENT  COMMENT '主键',
    name        VARCHAR(50)     UNIQUE NOT NULL             COMMENT '分类名称',
    description VARCHAR(255)    DEFAULT ''                  COMMENT '分类描述',
    sort_order  INT             DEFAULT 0                   COMMENT '排序权重（越大越靠前）',
    created_at  DATETIME        DEFAULT CURRENT_TIMESTAMP   COMMENT '创建时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='分类表';

-- 2.3 文章表
CREATE TABLE IF NOT EXISTS articles (
    id          INT             PRIMARY KEY AUTO_INCREMENT  COMMENT '主键',
    title       VARCHAR(200)    NOT NULL                    COMMENT '文章标题',
    summary     VARCHAR(500)    DEFAULT ''                  COMMENT '文章摘要',
    content     TEXT            NOT NULL                    COMMENT '文章正文（Markdown格式）',
    cover_image VARCHAR(255)    DEFAULT ''                  COMMENT '封面图片URL',
    user_id     INT             NOT NULL                    COMMENT '作者ID',
    category_id INT             NOT NULL                    COMMENT '分类ID',
    view_count  INT             DEFAULT 0                   COMMENT '阅读量',
    status      ENUM('published','draft') DEFAULT 'published' COMMENT '状态：published已发布/draft草稿',
    created_at  DATETIME        DEFAULT CURRENT_TIMESTAMP   COMMENT '发布时间',
    updated_at  DATETIME        DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (user_id)     REFERENCES users(id)         ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id)     ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='文章表';

-- 2.4 评论表
CREATE TABLE IF NOT EXISTS comments (
    id          INT             PRIMARY KEY AUTO_INCREMENT  COMMENT '主键',
    article_id  INT             NOT NULL                    COMMENT '文章ID',
    user_id     INT             NOT NULL                    COMMENT '评论者ID',
    content     TEXT            NOT NULL                    COMMENT '评论内容',
    created_at  DATETIME        DEFAULT CURRENT_TIMESTAMP   COMMENT '评论时间',
    FOREIGN KEY (article_id) REFERENCES articles(id)        ON DELETE CASCADE,
    FOREIGN KEY (user_id)    REFERENCES users(id)          ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='评论表';

-- ============================================
-- 3. 创建索引（提升查询性能）
-- ============================================

-- 文章表索引
CREATE INDEX idx_article_user ON articles(user_id);
CREATE INDEX idx_article_category ON articles(category_id);
CREATE INDEX idx_article_created ON articles(created_at);
CREATE INDEX idx_article_status ON articles(status);

-- 评论表索引
CREATE INDEX idx_comment_article ON comments(article_id);
CREATE INDEX idx_comment_user ON comments(user_id);

-- ============================================
-- 4. 创建视图（方便查询）
-- ============================================

-- 文章列表视图：关联作者名和分类名
CREATE OR REPLACE VIEW v_article_list AS
SELECT
    a.id,
    a.title,
    a.summary,
    a.cover_image,
    a.view_count,
    a.status,
    a.created_at,
    a.updated_at,
    u.username    AS author_name,
    c.name        AS category_name
FROM articles a
    LEFT JOIN users u      ON a.user_id = u.id
    LEFT JOIN categories c ON a.category_id = c.id
ORDER BY a.created_at DESC;

-- 文章统计视图：每个分类的文章数量
CREATE OR REPLACE VIEW v_category_stats AS
SELECT
    c.id,
    c.name,
    c.description,
    COUNT(a.id) AS article_count
FROM categories c
    LEFT JOIN articles a ON c.id = a.category_id AND a.status = 'published'
GROUP BY c.id, c.name, c.description;

-- ============================================
-- 5. 插入初始数据
-- ============================================

-- 5.1 插入默认管理员账号
-- 密码为 MD5('admin') = 21232f297a57a5a743894a0e4a801fc3
INSERT INTO users (username, password, email, role) VALUES
('admin', '21232f297a57a5a743894a0e4a801fc3', 'admin@blog.com', 'admin');

-- 5.2 插入测试普通用户
-- 密码为 MD5('123456') = e10adc3949ba59abbe56e057f20f883e
INSERT INTO users (username, password, email, role) VALUES
('zhangsan', 'e10adc3949ba59abbe56e057f20f883e', 'zhangsan@example.com', 'user'),
('lisi', 'e10adc3949ba59abbe56e057f20f883e', 'lisi@example.com', 'user');

-- 5.3 插入默认分类
INSERT INTO categories (name, description, sort_order) VALUES
('技术', '技术类文章，编程开发分享', 100),
('生活', '生活随笔，日常记录', 90),
('读书', '读书笔记，书评推荐', 80),
('教程', '教程指南，手把手教学', 70);

-- 5.4 插入示例文章
INSERT INTO articles (title, summary, content, user_id, category_id, view_count, status) VALUES
('Java Servlet 入门教程', '从零开始学习 Java Servlet，搭建你的第一个 Web 应用',
 '## 什么是 Servlet？\n\nServlet 是 Java 中用于处理 HTTP 请求的组件...\n\n### 第一步：创建 Servlet 类\n\n```java\n@WebServlet("/hello")\npublic class HelloServlet extends HttpServlet {\n    protected void doGet(...) {\n        resp.getWriter().write("Hello World");\n    }\n}\n```\n\n### 第二步：配置 Tomcat\n\n将项目部署到 Tomcat 服务器...',
 1, 1, 128, 'published'),

('React Hooks 实践总结', '总结 React Hooks 的常用模式和最佳实践',
 '## useState\n\n最基础的 Hook，用于管理组件状态。\n\n## useEffect\n\n处理副作用，如数据获取、订阅等。\n\n## useContext\n\n跨组件传递数据，避免 prop drilling。',
 2, 1, 256, 'published'),

('MySQL 索引优化指南', '深入理解 MySQL 索引原理，提升查询性能',
 '## 索引类型\n\n- B+Tree 索引\n- 哈希索引\n- 全文索引\n\n## 索引优化建议\n\n1. 为 WHERE 条件字段创建索引\n2. 避免在索引列上使用函数\n3. 合理使用复合索引',
 1, 1, 89, 'published'),

('我的大学生活', '记录大学四年的点点滴滴',
 '## 大一\n\n刚入学时的兴奋和迷茫...\n\n## 大二\n\n开始接触编程，打开了新世界的大门。\n\n## 大三\n\n课程设计、实习、项目...\n\n## 大四\n\n毕业设计，即将走向社会。',
 2, 2, 67, 'published'),

('《深入理解计算机系统》读后感', 'CSAPP 读书笔记',
 '## 第一章：计算机系统漫游\n\n从 Hello World 开始，了解一个程序从编写到执行的完整过程。\n\n## 第二章：信息的表示和处理\n\n整数、浮点数在计算机中的表示方式。',
 3, 3, 45, 'published');

-- 5.5 插入示例评论
INSERT INTO comments (article_id, user_id, content) VALUES
(1, 2, '写得很详细，对我帮助很大！'),
(1, 3, '建议再加一些关于 Filter 的内容'),
(2, 1, 'Hooks 确实比 class 组件好用多了'),
(3, 2, '索引优化的建议很实用，收藏了'),
(4, 1, '大学生活确实美好，珍惜当下'),
(4, 3, '同感！大三是最充实的一年'),
(5, 2, 'CSAPP 是本好书，推荐配合实验一起做');

-- ============================================
-- 6. 完成
-- ============================================
SELECT '数据库初始化完成！' AS message;
SELECT CONCAT('共创建 ', COUNT(*), ' 张表') AS info FROM information_schema.tables WHERE table_schema = 'blog_system';
