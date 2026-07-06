package com.blog.service;

import com.blog.dao.CategoryDao;
import com.blog.model.Category;

import java.util.List;

/**
 * 分类业务逻辑层
 */
public class CategoryService {

    private CategoryDao categoryDao = new CategoryDao();

    /**
     * 获取所有分类
     */
    public List<Category> getAllCategories() {
        return categoryDao.findAll();
    }

    /**
     * 根据ID获取分类
     */
    public Category getCategoryById(int id) {
        return categoryDao.findById(id);
    }

    /**
     * 新增分类
     */
    public boolean addCategory(Category category) {
        return categoryDao.insert(category);
    }

    /**
     * 更新分类
     */
    public boolean updateCategory(Category category) {
        return categoryDao.update(category);
    }

    /**
     * 删除分类
     */
    public boolean deleteCategory(int id) {
        return categoryDao.delete(id);
    }
}
