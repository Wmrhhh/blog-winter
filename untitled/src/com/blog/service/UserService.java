package com.blog.service;

import com.blog.dao.UserDao;
import com.blog.model.User;
import com.blog.util.MD5Util;

import java.util.List;

/**
 * 用户业务逻辑层
 */
public class UserService {

    private UserDao userDao = new UserDao();

    /**
     * 用户注册
     */
    public boolean register(String username, String password, String email) {
        // 检查用户名是否已存在
        if (userDao.findByUsername(username) != null) {
            return false; // 用户名已存在
        }
        // 密码 MD5 加密
        String encryptedPassword = MD5Util.md5(password);
        User user = new User();
        user.setUsername(username);
        user.setPassword(encryptedPassword);
        user.setEmail(email);
        user.setRole("user"); // 默认普通用户
        return userDao.insert(user);
    }

    /**
     * 用户登录
     * @return 登录成功返回 User 对象，失败返回 null
     */
    public User login(String username, String password) {
        User user = userDao.findByUsername(username);
        if (user == null) {
            return null; // 用户不存在
        }
        // 验证密码
        String encryptedPassword = MD5Util.md5(password);
        if (!encryptedPassword.equals(user.getPassword())) {
            return null; // 密码错误
        }
        // 返回不带密码的用户信息
        return user.toSafeUser();
    }

    /**
     * 根据ID获取用户（不含密码）
     */
    public User getUserById(int id) {
        User user = userDao.findById(id);
        if (user != null) {
            return user.toSafeUser();
        }
        return null;
    }

    /**
     * 获取所有用户列表（不含密码）
     */
    public List<User> getAllUsers() {
        List<User> users = userDao.findAll();
        // 移除密码字段
        for (User user : users) {
            user.setPassword(null);
        }
        return users;
    }

    /**
     * 删除用户
     */
    public boolean deleteUser(int id) {
        return userDao.delete(id);
    }

    /**
     * 统计用户总数
     */
    public int getUserCount() {
        return userDao.count();
    }
}
