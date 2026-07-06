package com.blog.filter;

import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * 跨域过滤器
 * 允许 React 前端跨域访问后端接口
 */
@WebFilter("/*")
public class CorsFilter implements Filter {

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        System.out.println("[CorsFilter] 跨域过滤器已启动");
    }

    @Override
    public void doFilter(ServletRequest req, ServletResponse resp, FilterChain chain)
            throws IOException, ServletException {
        HttpServletResponse response = (HttpServletResponse) resp;
        HttpServletRequest request = (HttpServletRequest) req;

        // 设置请求和响应编码为 UTF-8（解决中文乱码）
        request.setCharacterEncoding("UTF-8");
        response.setCharacterEncoding("UTF-8");
        // 允许所有来源跨域访问
        response.setHeader("Access-Control-Allow-Origin", "*");
        // 允许的请求方法
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        // 允许的请求头
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        // 预检请求缓存时间（1小时）
        response.setHeader("Access-Control-Max-Age", "3600");

        // 如果是 OPTIONS 预检请求，直接返回 200
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            response.setStatus(HttpServletResponse.SC_OK);
            return;
        }

        chain.doFilter(req, resp);
    }

    @Override
    public void destroy() {
    }
}
