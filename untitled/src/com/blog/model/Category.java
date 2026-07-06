package com.blog.model;

import java.util.Date;

/**
 * 分类实体类
 */
public class Category {
    private int id;
    private String name;
    private String description;
    private int sortOrder;
    private Date createdAt;

    // 关联字段（不映射到数据库，用于前端展示）
    private int articleCount;

    public Category() {}

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public int getSortOrder() { return sortOrder; }
    public void setSortOrder(int sortOrder) { this.sortOrder = sortOrder; }

    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }

    public int getArticleCount() { return articleCount; }
    public void setArticleCount(int articleCount) { this.articleCount = articleCount; }

    @Override
    public String toString() {
        return "Category{id=" + id + ", name='" + name + "'}";
    }
}
