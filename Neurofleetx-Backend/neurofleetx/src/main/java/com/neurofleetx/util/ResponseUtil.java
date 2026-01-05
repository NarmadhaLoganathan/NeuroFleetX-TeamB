package com.neurofleetx.util;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.Map;

public class ResponseUtil {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ApiResponse<T> {
        private int statusCode;
        private String message;
        private T data;
        private long timestamp = System.currentTimeMillis();
        private boolean success;
    }

    public static <T> ResponseEntity<ApiResponse<T>> success(String message, T data) {
        ApiResponse<T> response = new ApiResponse<>();
        response.setStatusCode(200);
        response.setMessage(message);
        response.setData(data);
        response.setSuccess(true);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    public static <T> ResponseEntity<ApiResponse<T>> created(String message, T data) {
        ApiResponse<T> response = new ApiResponse<>();
        response.setStatusCode(201);
        response.setMessage(message);
        response.setData(data);
        response.setSuccess(true);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    public static <T> ResponseEntity<ApiResponse<T>> badRequest(String message) {
        ApiResponse<T> response = new ApiResponse<>();
        response.setStatusCode(400);
        response.setMessage(message);
        response.setSuccess(false);
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    public static <T> ResponseEntity<ApiResponse<T>> unauthorized(String message) {
        ApiResponse<T> response = new ApiResponse<>();
        response.setStatusCode(401);
        response.setMessage(message);
        response.setSuccess(false);
        return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
    }

    public static <T> ResponseEntity<ApiResponse<T>> forbidden(String message) {
        ApiResponse<T> response = new ApiResponse<>();
        response.setStatusCode(403);
        response.setMessage(message);
        response.setSuccess(false);
        return new ResponseEntity<>(response, HttpStatus.FORBIDDEN);
    }

    public static <T> ResponseEntity<ApiResponse<T>> notFound(String message) {
        ApiResponse<T> response = new ApiResponse<>();
        response.setStatusCode(404);
        response.setMessage(message);
        response.setSuccess(false);
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    public static <T> ResponseEntity<ApiResponse<T>> serverError(String message) {
        ApiResponse<T> response = new ApiResponse<>();
        response.setStatusCode(500);
        response.setMessage(message);
        response.setSuccess(false);
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    public static Map<String, Object> toMap(String key, Object value) {
        Map<String, Object> map = new HashMap<>();
        map.put(key, value);
        return map;
    }

    public static Map<String, Object> toMap(String key1, Object value1, String key2, Object value2) {
        Map<String, Object> map = new HashMap<>();
        map.put(key1, value1);
        map.put(key2, value2);
        return map;
    }

    public static Map<String, Object> toMap(String key1, Object value1, String key2, Object value2,
                                            String key3, Object value3) {
        Map<String, Object> map = new HashMap<>();
        map.put(key1, value1);
        map.put(key2, value2);
        map.put(key3, value3);
        return map;
    }
}
