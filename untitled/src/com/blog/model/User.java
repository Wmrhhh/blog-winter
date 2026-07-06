package com.blog.model;

import java.util.Date;

/**
 * 用户实体类
 */
public class User {
    private int id;
    private String username;
    private String password;
    private String email;
    private String avatar;
    private String role;       // "admin" 或 "user"
    private Date createdAt;
    private Date updatedAt;

    public User() {}

    public User(int id, String username, String password, String email, String role) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.email = email;
        this.role = role;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getAvatar() { return avatar; }
    public void setAvatar(String avatar) { this.avatar = avatar; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }

    public Date getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Date updatedAt) { this.updatedAt = updatedAt; }

    /**
     * 判断是否是管理员
     */
    public boolean isAdmin() {
        return "admin".equals(this.role);
    }

    /**
     * 返回不含密码的用户信息（用于前端展示）
     */
    public User toSafeUser() {
        User safe = new User();
        safe.setId(this.id);
        safe.setUsername(this.username);
        safe.setEmail(this.email);
        safe.setAvatar(this.avatar);
        safe.setRole(this.role);
        safe.setCreatedAt(this.createdAt);
        safe.setUpdatedAt(this.updatedAt);
        return safe;
    }

    @Override
    public String toString() {
        return "User{id=" + id + ", username='" + username + "', role='" + role + "'}";
    }
}

