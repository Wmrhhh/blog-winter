package com.blog.service;

import com.blog.dao.CommentDao;
import com.blog.model.Comment;

import java.util.List;

/**
 * 评论业务逻辑层
 */
public class CommentService {

    private CommentDao commentDao = new CommentDao();

    /**
     * 获取文章的所有评论
     */
    public List<Comment> getCommentsByArticleId(int articleId) {
        return commentDao.findByArticleId(articleId);
    }

    /**
     * 发表评论
     */
    public boolean addComment(Comment comment) {
        if (comment.getContent() == null || comment.getContent().trim().isEmpty()) {
            return false; // 评论内容不能为空
        }
        return commentDao.insert(comment);
    }

    /**
     * 删除评论
     */
    public boolean deleteComment(int id) {
        return commentDao.delete(id);
    }
}
