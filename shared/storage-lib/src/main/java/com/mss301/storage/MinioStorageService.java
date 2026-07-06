package com.mss301.storage;

import com.mss301.common.exception.ApiException;
import com.mss301.common.exception.BadRequestException;
import com.mss301.common.exception.ErrorCode;
import io.minio.BucketExistsArgs;
import io.minio.MakeBucketArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.RemoveObjectArgs;
import io.minio.SetBucketPolicyArgs;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.multipart.MultipartFile;

import java.util.Locale;
import java.util.UUID;

/**
 * MinIO-backed {@link StorageService}. On construction it ensures the target
 * bucket exists and carries a public-read policy so returned URLs are directly
 * viewable (e.g. in an {@code <img>} tag).
 */
public class MinioStorageService implements StorageService {

    private static final Logger log = LoggerFactory.getLogger(MinioStorageService.class);

    private final MinioClient client;
    private final MinioProperties props;

    public MinioStorageService(MinioClient client, MinioProperties props) {
        this.client = client;
        this.props = props;
        ensureBucket();
    }

    private void ensureBucket() {
        try {
            boolean exists = client.bucketExists(BucketExistsArgs.builder().bucket(props.getBucket()).build());
            if (!exists) {
                client.makeBucket(MakeBucketArgs.builder().bucket(props.getBucket()).build());
            }
            client.setBucketPolicy(SetBucketPolicyArgs.builder()
                    .bucket(props.getBucket())
                    .config(publicReadPolicy(props.getBucket()))
                    .build());
            log.info("MinIO bucket '{}' ready (public read).", props.getBucket());
        } catch (Exception e) {
            // Do not block startup if MinIO is momentarily unreachable — uploads will surface the error.
            log.warn("MinIO bucket '{}' init skipped: {}", props.getBucket(), e.getMessage());
        }
    }

    @Override
    public String upload(MultipartFile file, String folder) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("File is empty");
        }
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new BadRequestException("Only image files are allowed");
        }
        String object = buildObjectName(folder, file.getOriginalFilename());
        try {
            client.putObject(PutObjectArgs.builder()
                    .bucket(props.getBucket())
                    .object(object)
                    .stream(file.getInputStream(), file.getSize(), -1)
                    .contentType(contentType)
                    .build());
        } catch (Exception e) {
            throw new ApiException(ErrorCode.INTERNAL_ERROR, "Image upload failed: " + e.getMessage(), e);
        }
        return props.resolvedPublicUrl() + "/" + props.getBucket() + "/" + object;
    }

    @Override
    public void delete(String url) {
        if (url == null || url.isBlank()) {
            return;
        }
        String marker = "/" + props.getBucket() + "/";
        int i = url.indexOf(marker);
        if (i < 0) {
            return;
        }
        String object = url.substring(i + marker.length());
        try {
            client.removeObject(RemoveObjectArgs.builder().bucket(props.getBucket()).object(object).build());
        } catch (Exception e) {
            log.warn("MinIO delete failed for '{}': {}", object, e.getMessage());
        }
    }

    private String buildObjectName(String folder, String originalName) {
        String ext = "";
        if (originalName != null) {
            int dot = originalName.lastIndexOf('.');
            if (dot >= 0 && dot < originalName.length() - 1) {
                ext = "." + originalName.substring(dot + 1).toLowerCase(Locale.ROOT).replaceAll("[^a-z0-9]", "");
            }
        }
        String safeFolder = (folder == null || folder.isBlank())
                ? "misc"
                : folder.replaceAll("[^a-zA-Z0-9_-]", "");
        return safeFolder + "/" + UUID.randomUUID() + ext;
    }

    private static String publicReadPolicy(String bucket) {
        return "{\"Version\":\"2012-10-17\",\"Statement\":[{\"Effect\":\"Allow\","
                + "\"Principal\":{\"AWS\":[\"*\"]},\"Action\":[\"s3:GetObject\"],"
                + "\"Resource\":[\"arn:aws:s3:::" + bucket + "/*\"]}]}";
    }
}
