package com.blog.service;

import com.blog.dao.ArticleDao;
import com.blog.model.Article;

import java.util.List;

/**
 * 文章业务逻辑层
 */
public class ArticleService {

    private ArticleDao articleDao = new ArticleDao();

    /**
     * 获取所有已发布文章列表
     */
    public List<Article> getAllPublishedArticles() {
        return articleDao.findAllPublished();
    }

    /**
     * 获取文章详情（同时增加阅读量）
     */
    public Article getArticleById(int id) {
        Article article = articleDao.findById(id);
        if (article != null) {
            // 异步增加阅读量（这里简单处理，直接调用）
            articleDao.incrementViewCount(id);
            article.setViewCount(article.getViewCount() + 1);
        }
        return article;
    }

    /**
     * 根据用户ID获取文章列表
     */
    public List<Article> getArticlesByUserId(int userId) {
        return articleDao.findByUserId(userId);
    }

    /**
     * 根据分类ID获取文章列表
     */
    public List<Article> getArticlesByCategoryId(int categoryId) {
        return articleDao.findByCategoryId(categoryId);
    }

    /**
     * 发布文章
     */
    public boolean publishArticle(Article article) {
        // 如果没有摘要，从内容中提取前100字作为摘要
        if (article.getSummary() == null || article.getSummary().isEmpty()) {
            String content = article.getContent();
            if (content != null && content.length() > 100) {
                article.setSummary(content.substring(0, 100) + "...");
            } else {
                article.setSummary(content);
            }
        }
        // 默认已发布状态
        if (article.getStatus() == null || article.getStatus().isEmpty()) {
            article.setStatus("published");
        }
        return articleDao.insert(article);
    }

    /**
     * 更新文章
     */
    public boolean updateArticle(Article article) {
        return articleDao.update(article);
    }

    /**
     * 删除文章
     */
    public boolean deleteArticle(int id) {
        return articleDao.delete(id);
    }

    /**
     * 检查用户是否是文章的作者
     */
    public boolean isAuthor(int articleId, int userId) {
        Article article = articleDao.findById(articleId);
        return article != null && article.getUserId() == userId;
    }

    /**
     * 统计已发布文章总数
     */
    public int getArticleCount() {
        return articleDao.count();
    }
}
