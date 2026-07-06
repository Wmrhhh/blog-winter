package com.blog.model;

import java.util.Date;

/**
 * 评论实体类
 */
public class Comment {
    private int id;
    private int articleId;
    private int userId;
    private String content;
    private Date createdAt;

    // 关联字段（不映射到数据库，用于前端展示）
    private String username;

    public Comment() {}

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public int getArticleId() { return articleId; }
    public void setArticleId(int articleId) { this.articleId = articleId; }

    public int getUserId() { return userId; }
    public void setUserId(int userId) { this.userId = userId; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    @Override
    public String toString() {
        return "Comment{id=" + id + ", articleId=" + articleId + ", userId=" + userId + "}";
    }
}
