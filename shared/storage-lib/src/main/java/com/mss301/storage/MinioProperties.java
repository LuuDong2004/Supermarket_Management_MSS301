package com.mss301.storage;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * MinIO connection + bucket settings, bound from the {@code minio.*} namespace.
 */
@ConfigurationProperties(prefix = "minio")
public class MinioProperties {

    /** Base S3 endpoint, e.g. {@code http://134.209.111.35:9000}. */
    private String endpoint;

    private String accessKey;

    private String secretKey;

    /** Single shared bucket for all images (must be a valid lowercase bucket name). */
    private String bucket = "sms-media";

    /**
     * Public base URL used to build returned image links. Defaults to {@link #endpoint}
     * when unset (useful when MinIO sits behind a different public host/CDN).
     */
    private String publicUrl;

    public String resolvedPublicUrl() {
        String base = (publicUrl != null && !publicUrl.isBlank()) ? publicUrl : endpoint;
        return base == null ? "" : base.replaceAll("/+$", "");
    }

    public String getEndpoint() {
        return endpoint;
    }

    public void setEndpoint(String endpoint) {
        this.endpoint = endpoint;
    }

    public String getAccessKey() {
        return accessKey;
    }

    public void setAccessKey(String accessKey) {
        this.accessKey = accessKey;
    }

    public String getSecretKey() {
        return secretKey;
    }

    public void setSecretKey(String secretKey) {
        this.secretKey = secretKey;
    }

    public String getBucket() {
        return bucket;
    }

    public void setBucket(String bucket) {
        this.bucket = bucket;
    }

    public String getPublicUrl() {
        return publicUrl;
    }

    public void setPublicUrl(String publicUrl) {
        this.publicUrl = publicUrl;
    }
}
