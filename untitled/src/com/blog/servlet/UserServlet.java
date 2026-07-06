package com.blog.servlet;

import com.blog.model.Result;
import com.blog.model.User;
import com.blog.service.UserService;
import com.blog.util.JsonUtil;
import com.blog.util.MD5Util;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.*;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 用户接口 Servlet
 * POST   /api/users/register → 用户注册
 * POST   /api/users/login    → 用户登录
 * GET    /api/users/me       → 获取当前用户信息
 * GET    /api/users          → 获取用户列表（仅admin）
 * DELETE /api/users/id       → 删除用户（仅admin）
 */
@WebServlet("/api/users/*")
public class UserServlet extends HttpServlet {

    private UserService userService = new UserService();

    /**
     * POST 请求：注册 或 登录
     */
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String pathInfo = req.getPathInfo();
        String body = readRequestBody(req);
        Map<String, Object> params = parseSimpleJson(body);

        // POST /api/users/register → 注册
        if ("/register".equals(pathInfo)) {
            String username = (String) params.get("username");
            String password = (String) params.get("password");
            String email = (String) params.getOrDefault("email", "");

            if (username == null || username.isEmpty() || password == null || password.isEmpty()) {
                JsonUtil.writeJson(resp, Result.error("用户名和密码不能为空"));
                return;
            }

            boolean success = userService.register(username, password, email);
            if (success) {
                JsonUtil.writeJson(resp, Result.success("注册成功", null));
            } else {
                JsonUtil.writeJson(resp, Result.error("用户名已存在"));
            }
            return;
        }

        // POST /api/users/login → 登录
        if ("/login".equals(pathInfo)) {
            String username = (String) params.get("username");
            String password = (String) params.get("password");

            if (username == null || password == null) {
                JsonUtil.writeJson(resp, Result.error("用户名和密码不能为空"));
                return;
            }

            User user = userService.login(username, password);
            if (user == null) {
                JsonUtil.writeJson(resp, Result.error(401, "用户名或密码错误"));
                return;
            }

            // 生成 Token：Base64(userId:role:username)
            String tokenData = user.getId() + ":" + user.getRole() + ":" + user.getUsername();
            String token = "Bearer " + Base64.getEncoder().encodeToString(tokenData.getBytes());

            // 返回用户信息和 Token
            Map<String, Object> data = new HashMap<>();
            data.put("user", user);
            data.put("token", token);
            JsonUtil.writeJson(resp, Result.success("登录成功", data));
            return;
        }

        JsonUtil.writeJson(resp, Result.error(404, "接口不存在"));
    }

    /**
     * GET 请求：获取当前用户信息 或 用户列表
     */
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String pathInfo = req.getPathInfo();

        // GET /api/users/me → 获取当前登录用户信息
        if ("/me".equals(pathInfo)) {
            int currentUserId = (int) req.getAttribute("currentUserId");
            User user = userService.getUserById(currentUserId);
            if (user != null) {
                JsonUtil.writeJson(resp, Result.success(user));
            } else {
                JsonUtil.writeJson(resp, Result.error("用户不存在"));
            }
            return;
        }

        // GET /api/users → 获取所有用户列表（admin 专属，由 AuthFilter 校验）
        if (pathInfo == null || pathInfo.equals("/") || pathInfo.equals("")) {
            List<User> users = userService.getAllUsers();
            JsonUtil.writeJson(resp, Result.success(users));
            return;
        }

        JsonUtil.writeJson(resp, Result.error(404, "接口不存在"));
    }

    /**
     * DELETE 请求：删除用户（admin 专属）
     */
    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String pathInfo = req.getPathInfo();
        if (pathInfo == null || pathInfo.equals("/")) {
            JsonUtil.writeJson(resp, Result.error("请指定要删除的用户ID"));
            return;
        }

        int userId;
        try {
            userId = Integer.parseInt(pathInfo.substring(1));
        } catch (NumberFormatException e) {
            JsonUtil.writeJson(resp, Result.error("无效的用户ID"));
            return;
        }

        boolean success = userService.deleteUser(userId);
        if (success) {
            JsonUtil.writeJson(resp, Result.success("删除成功", null));
        } else {
            JsonUtil.writeJson(resp, Result.error("删除失败"));
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
