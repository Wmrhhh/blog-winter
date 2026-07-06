package com.blog.model;

import java.util.Date;

/**
 * 文章实体类
 */
public class Article {
    private int id;
    private String title;
    private String summary;
    private String content;
    private String coverImage;
    private int userId;
    private int categoryId;
    private int viewCount;
    private String status;      // "published" 或 "draft"
    private Date createdAt;
    private Date updatedAt;

    // 关联字段（不映射到数据库，用于前端展示）
    private String authorName;
    private String categoryName;

    public Article() {}

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getCoverImage() { return coverImage; }
    public void setCoverImage(String coverImage) { this.coverImage = coverImage; }

    public int getUserId() { return userId; }
    public void setUserId(int userId) { this.userId = userId; }

    public int getCategoryId() { return categoryId; }
    public void setCategoryId(int categoryId) { this.categoryId = categoryId; }

    public int getViewCount() { return viewCount; }
    public void setViewCount(int viewCount) { this.viewCount = viewCount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }

    public Date getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Date updatedAt) { this.updatedAt = updatedAt; }

    public String getAuthorName() { return authorName; }
    public void setAuthorName(String authorName) { this.authorName = authorName; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

    @Override
    public String toString() {
        return "Article{id=" + id + ", title='" + title + "', userId=" + userId + ", categoryId=" + categoryId + "}";
    }
}
