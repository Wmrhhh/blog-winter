package com.blog.util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

/**
 * 数据库连接工具类
 * 负责获取和关闭数据库连接
 */
public class DBUtil {

    private static final String DRIVER = "com.mysql.cj.jdbc.Driver";
    private static final String URL = "jdbc:mysql://localhost:3306/blog_system?useSSL=false&serverTimezone=Asia/Shanghai&characterEncoding=utf8&allowPublicKeyRetrieval=true";
    private static final String USER = "root";
    private static final String PASSWORD = "Wangyuheng123!";  // 改成你的 MySQL 密码

    // 静态代码块：加载驱动（只需执行一次）
    static {
        try {
            Class.forName(DRIVER);
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
            throw new RuntimeException("MySQL 驱动加载失败", e);
        }
    }

    /**
     * 获取数据库连接
     */
    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(URL, USER, PASSWORD);
    }

    /**
     * 关闭资源（ResultSet + Statement + Connection）
     */
    public static void close(ResultSet rs, Statement stmt, Connection conn) {
        try { if (rs != null) rs.close(); } catch (SQLException e) { e.printStackTrace(); }
        try { if (stmt != null) stmt.close(); } catch (SQLException e) { e.printStackTrace(); }
        try { if (conn != null) conn.close(); } catch (SQLException e) { e.printStackTrace(); }
    }

    /**
     * 关闭资源（Statement + Connection）
     */
    public static void close(Statement stmt, Connection conn) {
        close(null, stmt, conn);
    }
}
