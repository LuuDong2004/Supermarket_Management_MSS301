package com.mss301.response;

import java.util.List;

/**
 * Lightweight, framework-agnostic pagination wrapper so services do not leak
 * Spring Data's {@code Page} type across the API boundary.
 */
public record PageResponse<T>(
        List<T> content,
        int page,
        int size,
        long totalElements,
        int totalPages,
        boolean last
) {
    public static <T> PageResponse<T> of(List<T> content, int page, int size,
                                         long totalElements, int totalPages, boolean last) {
        return new PageResponse<>(content, page, size, totalElements, totalPages, last);
    }
}
