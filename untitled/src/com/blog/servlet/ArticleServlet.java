package com.blog.servlet;

import com.blog.model.Article;
import com.blog.model.Result;
import com.blog.service.ArticleService;
import com.blog.service.UserService;
import com.blog.util.JsonUtil;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.BufferedReader;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.HashMap;


/**
 * 文章接口 Servlet
 * GET    /api/articles       → 获取文章列表
 * GET    /api/articles/id    → 获取文章详情
 * POST   /api/articles       → 发布文章
 * PUT    /api/articles/id    → 修改文章
 * DELETE /api/articles/id    → 删除文章
 */
@WebServlet("/api/articles/*")
public class ArticleServlet extends HttpServlet {

    private ArticleService articleService = new ArticleService();
    private UserService userService = new UserService();

    /**
     * GET 请求：获取文章列表 或 文章详情
     */
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String pathInfo = req.getPathInfo();

        // GET /api/articles → 获取文章列表
        if (pathInfo == null || pathInfo.equals("/") || pathInfo.equals("")) {
            // 支持按分类筛选
            String categoryIdParam = req.getParameter("categoryId");
            String userIdParam = req.getParameter("userId");
            List<Article> articles;

            if (categoryIdParam != null && !categoryIdParam.isEmpty()) {
                articles = articleService.getArticlesByCategoryId(Integer.parseInt(categoryIdParam));
            } else if (userIdParam != null && !userIdParam.isEmpty()) {
                articles = articleService.getArticlesByUserId(Integer.parseInt(userIdParam));
            } else {
                articles = articleService.getAllPublishedArticles();
            }
            JsonUtil.writeJson(resp, Result.success(articles));
            return;
        }

        // GET /api/articles/{id} → 获取文章详情
        int articleId = parseIdFromPath(pathInfo);
        if (articleId <= 0) {
            JsonUtil.writeJson(resp, Result.error(400, "无效的文章ID"));
            return;
        }
        Article article = articleService.getArticleById(articleId);
        if (article == null) {
            JsonUtil.writeJson(resp, Result.error(404, "文章不存在"));
            return;
        }
        JsonUtil.writeJson(resp, Result.success(article));
    }

    /**
     * POST 请求：发布文章
     */
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        int currentUserId = (int) req.getAttribute("currentUserId");

        String body = readRequestBody(req);
        Map<String, Object> params = parseSimpleJson(body);

        Article article = new Article();
        article.setTitle((String) params.get("title"));
        article.setContent((String) params.get("content"));
        article.setSummary((String) params.get("summary"));
        article.setCoverImage((String) params.get("coverImage"));
        article.setUserId(currentUserId);

        // 处理 categoryId
        Object categoryIdObj = params.get("categoryId");
        if (categoryIdObj != null) {
            article.setCategoryId(Integer.parseInt(categoryIdObj.toString()));
        } else {
            article.setCategoryId(1); // 默认分类
        }

        article.setStatus((String) params.getOrDefault("status", "published"));

        boolean success = articleService.publishArticle(article);
        if (success) {
            JsonUtil.writeJson(resp, Result.success("发布成功", null));
        } else {
            JsonUtil.writeJson(resp, Result.error("发布失败"));
        }
    }

    /**
     * PUT 请求：修改文章
     */
    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        int currentUserId = (int) req.getAttribute("currentUserId");
        String currentUserRole = (String) req.getAttribute("currentUserRole");

        String pathInfo = req.getPathInfo();
        int articleId = parseIdFromPath(pathInfo);

        // 权限检查：只有作者本人或 admin 才能修改
        if (!"admin".equals(currentUserRole) && !articleService.isAuthor(articleId, currentUserId)) {
            JsonUtil.writeJson(resp, Result.error(403, "无权修改此文章"));
            return;
        }

        String body = readRequestBody(req);
        Map<String, Object> params = parseSimpleJson(body);

        Article article = articleService.getArticleById(articleId);
        if (article == null) {
            JsonUtil.writeJson(resp, Result.error(404, "文章不存在"));
            return;
        }

        // 更新字段
        if (params.containsKey("title")) article.setTitle((String) params.get("title"));
        if (params.containsKey("content")) article.setContent((String) params.get("content"));
        if (params.containsKey("summary")) article.setSummary((String) params.get("summary"));
        if (params.containsKey("coverImage")) article.setCoverImage((String) params.get("coverImage"));
        if (params.containsKey("categoryId")) article.setCategoryId(Integer.parseInt(params.get("categoryId").toString()));
        if (params.containsKey("status")) article.setStatus((String) params.get("status"));

        boolean success = articleService.updateArticle(article);
        if (success) {
            JsonUtil.writeJson(resp, Result.success("修改成功", null));
        } else {
            JsonUtil.writeJson(resp, Result.error("修改失败"));
        }
    }

    /**
     * DELETE 请求：删除文章
     */
    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        int currentUserId = (int) req.getAttribute("currentUserId");
        String currentUserRole = (String) req.getAttribute("currentUserRole");

        String pathInfo = req.getPathInfo();
        int articleId = parseIdFromPath(pathInfo);

        // 权限检查
        if (!"admin".equals(currentUserRole) && !articleService.isAuthor(articleId, currentUserId)) {
            JsonUtil.writeJson(resp, Result.error(403, "无权删除此文章"));
            return;
        }

        boolean success = articleService.deleteArticle(articleId);
        if (success) {
            JsonUtil.writeJson(resp, Result.success("删除成功", null));
        } else {
            JsonUtil.writeJson(resp, Result.error("删除失败"));
        }
    }

    /**
     * 从路径中解析 ID
     * /api/articles/123 → 123
     */
    private int parseIdFromPath(String pathInfo) {
        if (pathInfo == null || pathInfo.isEmpty()) return -1;
        pathInfo = pathInfo.startsWith("/") ? pathInfo.substring(1) : pathInfo;
        try {
            return Integer.parseInt(pathInfo);
        } catch (NumberFormatException e) {
            return -1;
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
     * 简易 JSON 解析（不依赖第三方库）
     * 支持 "key": "value" 和 "key": number 格式
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
