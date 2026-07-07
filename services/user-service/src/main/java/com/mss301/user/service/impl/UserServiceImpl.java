package com.mss301.user.service.impl;

import com.mss301.response.PageResponse;
import com.mss301.common.dto.internal.InternalCreateUserRequest;
import com.mss301.common.dto.internal.InternalUserResponse;
import com.mss301.common.enums.UserStatus;
import com.mss301.common.exception.BadRequestException;
import com.mss301.user.dto.request.AdminUpdateUserRequest;
import com.mss301.common.exception.ConflictException;
import com.mss301.common.exception.ErrorCode;
import com.mss301.common.exception.ResourceNotFoundException;
import com.mss301.user.dto.request.ChangePasswordRequest;
import com.mss301.user.dto.request.CreateUserRequest;
import com.mss301.user.dto.request.UpdateProfileRequest;
import com.mss301.user.dto.response.UserResponse;
import com.mss301.user.entity.User;
import com.mss301.user.mapper.UserMapper;
import com.mss301.user.repository.UserRepository;
import com.mss301.user.service.interfaces.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserResponse createUser(CreateUserRequest request) {
        guardUniqueness(request.username(), request.email());
        User user = User.builder()
                .username(request.username())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .fullName(request.fullName())
                .phone(request.phone())
                .role(request.role())
                .status(UserStatus.ACTIVE)
                .build();
        return userMapper.toResponse(userRepository.save(user));
    }

    @Override
    public UserResponse updateProfile(UUID userId, UpdateProfileRequest request) {
        User user = findActive(userId);
        user.setFullName(request.fullName());
        user.setPhone(request.phone());
        return userMapper.toResponse(user);
    }

    @Override
    public UserResponse updateUser(UUID userId, AdminUpdateUserRequest request) {
        User user = findActive(userId);
        user.setFullName(request.fullName());
        user.setPhone(request.phone());
        if (request.role() != null) {
            user.setRole(request.role());
        }
        if (request.status() != null) {
            user.setStatus(request.status());
        }
        return userMapper.toResponse(user);
    }

    @Override
    public void changePassword(UUID userId, ChangePasswordRequest request) {
        User user = findActive(userId);
        if (!passwordEncoder.matches(request.currentPassword(), user.getPassword())) {
            throw new BadRequestException(ErrorCode.INVALID_CREDENTIALS, "Current password is incorrect");
        }
        user.setPassword(passwordEncoder.encode(request.newPassword()));
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getById(UUID id) {
        return userMapper.toResponse(findActive(id));
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<UserResponse> getAllUsers(Pageable pageable) {
        Page<UserResponse> page = userRepository.findAll(pageable).map(userMapper::toResponse);
        return PageResponse.of(
                page.getContent(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isLast()
        );
    }

    @Override
    public void softDelete(UUID id) {
        User user = findActive(id);
        userRepository.delete(user); // @SQLDelete flips the deleted flag
    }

    @Override
    @Transactional(readOnly = true)
    public InternalUserResponse getByUsernameInternal(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.USER_NOT_FOUND));
        return userMapper.toInternalResponse(user);
    }

    @Override
    public InternalUserResponse createInternal(InternalCreateUserRequest request) {
        guardUniqueness(request.username(), request.email());
        User user = User.builder()
                .username(request.username())
                .email(request.email())
                .password(request.passwordHash()) // already hashed by auth-service
                .fullName(request.fullName())
                .phone(request.phone())
                .role(request.role())
                .status(UserStatus.ACTIVE)
                .build();
        return userMapper.toInternalResponse(userRepository.save(user));
    }

    private void guardUniqueness(String username, String email) {
        if (userRepository.existsByUsername(username)) {
            throw new ConflictException(ErrorCode.USERNAME_ALREADY_EXISTS);
        }
        if (userRepository.existsByEmail(email)) {
            throw new ConflictException(ErrorCode.EMAIL_ALREADY_EXISTS);
        }
    }

    private User findActive(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.USER_NOT_FOUND));
    }
}
