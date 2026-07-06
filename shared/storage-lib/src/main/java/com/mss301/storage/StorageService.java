package com.mss301.storage;

import org.springframework.web.multipart.MultipartFile;

/**
 * Object-storage abstraction for image uploads. Backed by MinIO (S3-compatible).
 */
public interface StorageService {

    /**
     * Uploads {@code file} under the given logical {@code folder} (e.g. "products")
     * and returns a publicly accessible URL to the stored object.
     *
     * @throws com.mss301.common.exception.ApiException if the file is empty/invalid or upload fails
     */
    String upload(MultipartFile file, String folder);

    /**
     * Best-effort delete of a previously stored object, addressed by the public URL
     * returned from {@link #upload}. Silently ignores unknown/blank URLs.
     */
    void delete(String url);
}
