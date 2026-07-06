package com.blog.servlet;

import com.blog.model.Comment;
import com.blog.model.Result;
import com.blog.service.CommentService;
import com.blog.util.JsonUtil;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 评论接口 Servlet
 * GET    /api/comments/{articleId} → 获取文章评论列表
 * POST   /api/comments            → 发表评论
 * DELETE /api/comments/{id}       → 删除评论（仅admin）
 */
@WebServlet("/api/comments/*")
public class CommentServlet extends HttpServlet {

    private CommentService commentService = new CommentService();

    /**
     * GET 请求：获取文章评论
     * GET /api/comments/123 → 获取文章ID为123的所有评论
     */
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String pathInfo = req.getPathInfo();
        if (pathInfo == null || pathInfo.equals("/")) {
            JsonUtil.writeJson(resp, Result.error("请指定文章ID"));
            return;
        }

        try {
            int articleId = Integer.parseInt(pathInfo.substring(1));
            List<Comment> comments = commentService.getCommentsByArticleId(articleId);
            JsonUtil.writeJson(resp, Result.success(comments));
        } catch (NumberFormatException e) {
            JsonUtil.writeJson(resp, Result.error("无效的文章ID"));
        }
    }

    /**
     * POST 请求：发表评论
     */
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        int currentUserId = (int) req.getAttribute("currentUserId");

        String body = readRequestBody(req);
        Map<String, Object> params = parseSimpleJson(body);

        String content = (String) params.get("content");
        Object articleIdObj = params.get("articleId");

        if (content == null || content.trim().isEmpty()) {
            JsonUtil.writeJson(resp, Result.error("评论内容不能为空"));
            return;
        }
        if (articleIdObj == null) {
            JsonUtil.writeJson(resp, Result.error("请指定文章ID"));
            return;
        }

        Comment comment = new Comment();
        comment.setArticleId(Integer.parseInt(articleIdObj.toString()));
        comment.setUserId(currentUserId);
        comment.setContent(content);

        boolean success = commentService.addComment(comment);
        if (success) {
            JsonUtil.writeJson(resp, Result.success("评论成功", null));
        } else {
            JsonUtil.writeJson(resp, Result.error("评论失败"));
        }
    }

    /**
     * DELETE 请求：删除评论（仅 admin）
     */
    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String pathInfo = req.getPathInfo();
        if (pathInfo == null || pathInfo.equals("/")) {
            JsonUtil.writeJson(resp, Result.error("请指定评论ID"));
            return;
        }

        try {
            int commentId = Integer.parseInt(pathInfo.substring(1));
            boolean success = commentService.deleteComment(commentId);
            if (success) {
                JsonUtil.writeJson(resp, Result.success("删除成功", null));
            } else {
                JsonUtil.writeJson(resp, Result.error("删除失败"));
            }
        } catch (NumberFormatException e) {
            JsonUtil.writeJson(resp, Result.error("无效的评论ID"));
        }
    }

    /**
     * 读取请求体
     */
    private String readRequestBody(HttpServletRequest req) throws IOException {
        req.setCharacterEncoding("UTF-8");
        BufferedReader reader = req.getReader();
        return reader.lines().collect(Collectors.joining());
    }

    /**
     * 简易 JSON 解析
     */
    private Map<String, Object> parseSimpleJson(String json) {
        Map<String, Object> map = new HashMap<>();
        if (json == null || json.isEmpty()) return map;

        json = json.trim();
        if (json.startsWith("{")) json = json.substring(1);
        if (json.endsWith("}")) json = json.substring(0, json.length() - 1);

        String[] pairs = json.split(",");
        for (String pair : pairs) {
            int colonIndex = pair.indexOf(":");
            if (colonIndex < 0) continue;

            String key = pair.substring(0, colonIndex).trim()
                    .replace("\"", "").trim();
            String value = pair.substring(colonIndex + 1).trim();

            if (value.startsWith("\"") && value.endsWith("\"")) {
                map.put(key, value.substring(1, value.length() - 1));
            } else {
                try {
                    if (value.contains(".")) {
                        map.put(key, Double.parseDouble(value));
                    } else {
                        map.put(key, Integer.parseInt(value));
                    }
                } catch (NumberFormatException e) {
                    map.put(key, value);
                }
            }
        }
        return map;
    }
}
