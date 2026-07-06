package com.blog.filter;

import com.blog.model.User;
import com.blog.service.UserService;

import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

/**
 * 权限校验过滤器
 * 对需要登录/admin权限的接口进行鉴权
 *
 * 使用方式：通过请求头 Authorization 传递 Token
 * Token 格式：Bearer base64(userId:role)
 */
@WebFilter("/api/*")
public class AuthFilter implements Filter {

    private UserService userService = new UserService();

    // 不需要登录就能访问的接口
    private static final String[] PUBLIC_URLS = {
            "/api/users/register",
            "/api/users/login",
            "/api/articles",       // GET
            "/api/articles/",      // GET (后面跟ID)
            "/api/categories",     // GET
            "/api/categories/",     // GET
            "/api/comments/",       // GET (按文章ID查评论)
    };

    // 只有 admin 才能访问的接口
    private static final String[] ADMIN_URLS = {
            "/api/users",
    };

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        System.out.println("[AuthFilter] 权限过滤器已启动");
    }

    @Override
    public void doFilter(ServletRequest req, ServletResponse resp, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) req;
        HttpServletResponse response = (HttpServletResponse) resp;

        // 先设置 CORS 头，确保即使返回错误，前端也不会报跨域
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

        String method = request.getMethod();
        String path = request.getRequestURI().substring(request.getContextPath().length());

        // 1. OPTIONS 预检请求直接放行
        if ("OPTIONS".equalsIgnoreCase(method)) {
            response.setStatus(HttpServletResponse.SC_OK);
            return;
        }

        // 2. 公开接口直接放行
        if (isPublicUrl(path, method)) {
            chain.doFilter(req, resp);
            return;
        }

        // 3. 从请求头获取 Token
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            sendError(response, 401, "未登录，请先登录");
            return;
        }

        // 4. 解析 Token（格式：Bearer base64(userId:role)）
        try {
            String token = authHeader.substring(7);
            String decoded = new String(Base64.getDecoder().decode(token));
            String[] parts = decoded.split(":");
            if (parts.length < 2) {
                sendError(response, 401, "Token 格式错误");
                return;
            }

            int userId = Integer.parseInt(parts[0]);
            String role = parts[1];

            // 5. 检查 admin 权限
            if (isAdminUrl(path) && !"admin".equals(role)) {
                sendError(response, 403, "权限不足，仅管理员可访问");
                return;
            }

            // 6. 把用户信息存到 request 属性中，供 Servlet 使用
            request.setAttribute("currentUserId", userId);
            request.setAttribute("currentUserRole", role);

            chain.doFilter(req, resp);
        } catch (Exception e) {
            sendError(response, 401, "Token 无效");
        }
    }

    /**
     * 判断是否是公开接口
     */
    private boolean isPublicUrl(String path, String method) {
        // GET 请求的文章、分类、评论列表是公开的
        if ("GET".equalsIgnoreCase(method)) {
            for (String publicUrl : PUBLIC_URLS) {
                if (publicUrl.endsWith("/")) {
                    // 匹配前缀，如 /api/articles/123
                    if (path.startsWith(publicUrl)) return true;
                } else {
                    // 精确匹配，如 /api/articles
                    if (path.equals(publicUrl)) return true;
                }
            }
        }
        // POST 的注册和登录也是公开的
        if ("POST".equalsIgnoreCase(method)) {
            if (path.equals("/api/users/register") || path.equals("/api/users/login")) {
                return true;
            }
        }
        return false;
    }

    /**
     * 判断是否是 admin 专属接口
     */
    private boolean isAdminUrl(String path) {
        // GET /api/users（获取用户列表）是 admin 专属
        // DELETE /api/users/xxx（删除用户）是 admin 专属
        if (path.equals("/api/users") && !path.contains("/")) {
            return true;
        }
        if (path.startsWith("/api/users/") && path.split("/").length <= 4) {
            return true;
        }
        // POST/PUT/DELETE 分类是 admin 专属
        if (path.startsWith("/api/categories") && !path.equals("/api/categories")) {
            return true;
        }
        return false;
    }

    /**
     * 返回错误 JSON
     */
    private void sendError(HttpServletResponse response, int code, String message) throws IOException {
        response.setContentType("application/json;charset=UTF-8");
        response.setStatus(code);
        response.getWriter().write(
                "{\"code\":" + code + ",\"message\":\"" + message + "\",\"data\":null}"
        );
    }

    @Override
    public void destroy() {
    }
}
