package com.blog.util;

import com.blog.model.Result;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * JSON 工具类
 * 手动实现 JSON 序列化（不依赖第三方库）
 */
public class JsonUtil {

    private static final SimpleDateFormat DATE_FORMAT = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

    /**
     * 将对象转为 JSON 字符串
     */
    public static String toJson(Object obj) {
        if (obj == null) return "null";
        if (obj instanceof String) return "\"" + escapeString((String) obj) + "\"";
        if (obj instanceof Number || obj instanceof Boolean) return obj.toString();
        if (obj instanceof Date) return "\"" + DATE_FORMAT.format((Date) obj) + "\"";
        if (obj instanceof List) return listToJson((List<?>) obj);
        if (obj instanceof Map) return mapToJson((Map<?, ?>) obj);
        if (obj instanceof Result) return resultToJson((Result<?>) obj);
        return objectToJson(obj);
    }

    /**
     * 将 Result 对象转为 JSON
     */
    private static String resultToJson(Result<?> result) {
        StringBuilder sb = new StringBuilder();
        sb.append("{");
        sb.append("\"code\":").append(result.getCode()).append(",");
        sb.append("\"message\":\"").append(escapeString(result.getMessage())).append("\",");
        sb.append("\"data\":");
        if (result.getData() == null) {
            sb.append("null");
        } else {
            sb.append(toJson(result.getData()));
        }
        sb.append("}");
        return sb.toString();
    }

    /**
     * 将 List 转为 JSON 数组
     */
    private static String listToJson(List<?> list) {
        StringBuilder sb = new StringBuilder();
        sb.append("[");
        for (int i = 0; i < list.size(); i++) {
            if (i > 0) sb.append(",");
            sb.append(toJson(list.get(i)));
        }
        sb.append("]");
        return sb.toString();
    }

    /**
     * 将 Map 转为 JSON 对象
     */
    private static String mapToJson(Map<?, ?> map) {
        StringBuilder sb = new StringBuilder();
        sb.append("{");
        boolean first = true;
        for (Map.Entry<?, ?> entry : map.entrySet()) {
            if (!first) sb.append(",");
            sb.append("\"").append(escapeString(entry.getKey().toString())).append("\":");
            sb.append(toJson(entry.getValue()));
            first = false;
        }
        sb.append("}");
        return sb.toString();
    }

    /**
     * 将普通 JavaBean 转为 JSON 对象（通过反射读取 getter 方法）
     */
    private static String objectToJson(Object obj) {
        try {
            StringBuilder sb = new StringBuilder();
            sb.append("{");
            java.lang.reflect.Method[] methods = obj.getClass().getMethods();
            List<String> jsonFields = new ArrayList<>();

            for (java.lang.reflect.Method method : methods) {
                String name = method.getName();
                // 找到所有 getXxx 方法
                if (name.startsWith("get") && name.length() > 3
                        && method.getParameterCount() == 0
                        && !name.equals("getClass")) {
                    String fieldName = name.substring(3, 4).toLowerCase() + name.substring(4);
                    Object value = method.invoke(obj);
                    jsonFields.add("\"" + fieldName + "\":" + toJson(value));
                }
            }

            sb.append(String.join(",", jsonFields));
            sb.append("}");
            return sb.toString();
        } catch (Exception e) {
            e.printStackTrace();
            return "{}";
        }
    }

    /**
     * 转义 JSON 字符串中的特殊字符
     */
    private static String escapeString(String str) {
        if (str == null) return "";
        return str.replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "\\r")
                .replace("\t", "\\t");
    }

    /**
     * 向 HttpServletResponse 写入 JSON 响应
     */
    public static void writeJson(HttpServletResponse resp, Result<?> result) throws IOException {
        resp.setContentType("application/json;charset=UTF-8");
        resp.setCharacterEncoding("UTF-8");
        PrintWriter out = resp.getWriter();
        out.write(toJson(result));
        out.flush();
    }
}
