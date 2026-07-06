package com.blog.servlet;

import com.blog.model.Category;
import com.blog.model.Result;
import com.blog.service.CategoryService;
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
 * 分类接口 Servlet
 * GET    /api/categories       → 获取分类列表（公开）
 * POST   /api/categories       → 新增分类（仅admin）
 * PUT    /api/categories/{id}   → 修改分类（仅admin）
 * DELETE /api/categories/{id}   → 删除分类（仅admin）
 */
@WebServlet("/api/categories/*")
public class CategoryServlet extends HttpServlet {

    private CategoryService categoryService = new CategoryService();

    /**
     * GET 请求：获取分类列表
     */
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String pathInfo = req.getPathInfo();

        // GET /api/categories → 所有分类
        if (pathInfo == null || pathInfo.equals("/") || pathInfo.equals("")) {
            List<Category> categories = categoryService.getAllCategories();
            JsonUtil.writeJson(resp, Result.success(categories));
            return;
        }

        // GET /api/categories/{id} → 单个分类
        try {
            int categoryId = Integer.parseInt(pathInfo.substring(1));
            Category category = categoryService.getCategoryById(categoryId);
            if (category != null) {
                JsonUtil.writeJson(resp, Result.success(category));
            } else {
                JsonUtil.writeJson(resp, Result.error(404, "分类不存在"));
            }
        } catch (NumberFormatException e) {
            JsonUtil.writeJson(resp, Result.error("无效的分类ID"));
        }
    }

    /**
     * POST 请求：新增分类（仅 admin）
     */
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String body = readRequestBody(req);
        Map<String, Object> params = parseSimpleJson(body);

        String name = (String) params.get("name");
        String description = (String) params.getOrDefault("description", "");
        int sortOrder = 0;
        if (params.get("sortOrder") != null) {
            sortOrder = Integer.parseInt(params.get("sortOrder").toString());
        }

        if (name == null || name.trim().isEmpty()) {
            JsonUtil.writeJson(resp, Result.error("分类名称不能为空"));
            return;
        }

        Category category = new Category();
        category.setName(name);
        category.setDescription(description);
        category.setSortOrder(sortOrder);

        boolean success = categoryService.addCategory(category);
        if (success) {
            JsonUtil.writeJson(resp, Result.success("新增成功", null));
        } else {
            JsonUtil.writeJson(resp, Result.error("新增失败，分类名可能已存在"));
        }
    }

    /**
     * PUT 请求：修改分类（仅 admin）
     */
    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String pathInfo = req.getPathInfo();
        if (pathInfo == null || pathInfo.equals("/")) {
            JsonUtil.writeJson(resp, Result.error("请指定分类ID"));
            return;
        }

        try {
            int categoryId = Integer.parseInt(pathInfo.substring(1));
            Category category = categoryService.getCategoryById(categoryId);
            if (category == null) {
                JsonUtil.writeJson(resp, Result.error(404, "分类不存在"));
                return;
            }

            String body = readRequestBody(req);
            Map<String, Object> params = parseSimpleJson(body);

            if (params.containsKey("name")) category.setName((String) params.get("name"));
            if (params.containsKey("description")) category.setDescription((String) params.get("description"));
            if (params.containsKey("sortOrder")) category.setSortOrder(Integer.parseInt(params.get("sortOrder").toString()));

            boolean success = categoryService.updateCategory(category);
            if (success) {
                JsonUtil.writeJson(resp, Result.success("修改成功", null));
            } else {
                JsonUtil.writeJson(resp, Result.error("修改失败"));
            }
        } catch (NumberFormatException e) {
            JsonUtil.writeJson(resp, Result.error("无效的分类ID"));
        }
    }

    /**
     * DELETE 请求：删除分类（仅 admin）
     */
    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String pathInfo = req.getPathInfo();
        if (pathInfo == null || pathInfo.equals("/")) {
            JsonUtil.writeJson(resp, Result.error("请指定分类ID"));
            return;
        }

        try {
            int categoryId = Integer.parseInt(pathInfo.substring(1));
            boolean success = categoryService.deleteCategory(categoryId);
            if (success) {
                JsonUtil.writeJson(resp, Result.success("删除成功", null));
            } else {
                JsonUtil.writeJson(resp, Result.error("删除失败，该分类下可能还有文章"));
            }
        } catch (NumberFormatException e) {
            JsonUtil.writeJson(resp, Result.error("无效的分类ID"));
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
