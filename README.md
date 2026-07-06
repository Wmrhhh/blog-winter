# 个人博客系统

基于 **React + Java Servlet + MySQL** 的全栈个人博客平台，采用经典三层架构设计，支持多角色权限管理。

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | React 18 + Vite + React Router + Axios |
| 后端 | Java Servlet + JDBC（无框架） |
| 数据库 | MySQL 8.0 |
| 服务器 | Apache Tomcat 9 |
| 认证 | Base64 Token |
| 加密 | MD5 |

## 项目结构

```
blog-system/
├── init.sql                    # 数据库初始化脚本
├── frontend/                   # React 前端
│   ├── src/
│   │   ├── api/               #   API 接口封装
│   │   ├── components/        #   公共组件（Header、Footer、ArticleCard）
│   │   ├── context/           #   React Context 状态管理
│   │   ├── pages/             #   页面组件
│   │   ├── App.jsx            #   路由配置
│   │   ├── main.jsx           #   入口文件
│   │   └── index.css          #   全局样式
│   ├── package.json
│   ├── index.html
│   └── vite.config.js
└── backend/                    # Java Servlet 后端
    └── src/
        ├── model/             #   实体类（User、Article、Comment、Category、Result）
        ├── util/              #   工具类（DBUtil、JsonUtil、MD5Util）
        ├── dao/               #   数据访问层（UserDao、ArticleDao、CommentDao、CategoryDao）
        ├── service/           #   业务逻辑层（UserService、ArticleService、CommentService、CategoryService）
        ├── servlet/           #   接口层（ArticleServlet、UserServlet、CommentServlet、CategoryServlet）
        └── filter/            #   过滤器（CorsFilter、AuthFilter）
```

## 功能特性

### 用户系统
- 注册 / 登录 / 退出
- 多角色权限：管理员（admin）、普通用户（user）
- Token 认证，密码 MD5 加密存储

### 文章系统
- 文章发布、编辑、删除
- 按分类筛选浏览
- 阅读量自动统计
- 自动提取摘要

### 评论系统
- 登录用户发表评论
- 作者 / 管理员可删除评论

### 分类管理
- 管理员可增删分类
- 每个分类显示文章数量

### 前端设计
- 渐变主题 UI
- 动态光球背景动画
- 响应式布局
- 骨架屏加载动画

## 环境要求

- JDK 8+
- MySQL 8.0
- Apache Tomcat 9.0
- Node.js 16+
- IDEA（推荐 Community 版 + Smart Tomcat 插件）

## 快速开始

### 1. 初始化数据库

```bash
mysql -u root -p < init.sql
```

### 2. 配置后端

修改 `backend/src/util/DBUtil.java` 中的数据库密码：

```java
private static final String PASSWORD = "你的MySQL密码";
```

在 IDEA 中配置 Smart Tomcat：
- Tomcat Server：选择 Tomcat 安装路径
- Deployment Directory：选择 `backend/web` 目录
- Context Path：`/blog`
- Server Port：`8080`

### 3. 启动后端

在 IDEA 中启动 Tomcat，确认控制台输出：

```
[CorsFilter] 跨域过滤器已启动
[AuthFilter] 权限过滤器已启动
```

后端地址：`http://localhost:8080/blog`

### 4. 启动前端

```bash
cd frontend
npm install
npm run dev
```

前端地址：`http://localhost:5173`

### 5. 配置前端 API 地址

修改 `frontend/src/api/request.js` 中的 baseURL，确保与 Tomcat Context Path 一致：

```javascript
baseURL: 'http://localhost:8080/blog/api'
```

## 测试账号

| 用户名 | 密码 | 角色 |
|--------|------|------|
| admin | admin | 管理员 |
| zhangsan | 123456 | 普通用户 |
| lisi | 123456 | 普通用户 |

## API 接口

| 方法 | 路径 | 说明 | 权限 |
|------|------|------|------|
| POST | /api/users/register | 注册 | 公开 |
| POST | /api/users/login | 登录 | 公开 |
| GET | /api/users/me | 当前用户信息 | 登录 |
| GET | /api/users | 用户列表 | admin |
| DELETE | /api/users/{id} | 删除用户 | admin |
| GET | /api/articles | 文章列表 | 公开 |
| GET | /api/articles/{id} | 文章详情 | 公开 |
| POST | /api/articles | 发布文章 | 登录 |
| PUT | /api/articles/{id} | 修改文章 | 作者/admin |
| DELETE | /api/articles/{id} | 删除文章 | 作者/admin |
| GET | /api/comments/{articleId} | 评论列表 | 公开 |
| POST | /api/comments | 发表评论 | 登录 |
| DELETE | /api/comments/{id} | 删除评论 | 作者/admin |
| GET | /api/categories | 分类列表 | 公开 |
| POST | /api/categories | 新增分类 | admin |
| DELETE | /api/categories/{id} | 删除分类 | admin |

## 数据库表结构

- **users** — 用户表（id、username、password、email、role、created_at）
- **articles** — 文章表（id、title、content、summary、user_id、category_id、status、view_count）
- **comments** — 评论表（id、content、article_id、user_id、created_at）
- **categories** — 分类表（id、name、description、created_at）

## 架构设计

```
浏览器（React）
    ↓ HTTP Request (Axios)
CorsFilter → AuthFilter（跨域 + 鉴权）
    ↓
Servlet（ArticleServlet / UserServlet / CommentServlet / CategoryServlet）
    ↓
Service（业务逻辑）
    ↓
DAO（JDBC 数据访问）
    ↓
MySQL 数据库
```

## License

MIT
