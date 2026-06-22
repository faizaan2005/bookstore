package com.bookstore.dto;

import com.bookstore.entity.Role;
import java.time.LocalDateTime;

public class UserDto {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String address;
    private String avatar;
    private Role role;
    private boolean enabled;
    private LocalDateTime createdAt;
    private int totalOrders;

    public UserDto() {}

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final UserDto d = new UserDto();
        public Builder id(Long v) { d.id = v; return this; }
        public Builder firstName(String v) { d.firstName = v; return this; }
        public Builder lastName(String v) { d.lastName = v; return this; }
        public Builder email(String v) { d.email = v; return this; }
        public Builder phone(String v) { d.phone = v; return this; }
        public Builder address(String v) { d.address = v; return this; }
        public Builder avatar(String v) { d.avatar = v; return this; }
        public Builder role(Role v) { d.role = v; return this; }
        public Builder enabled(boolean v) { d.enabled = v; return this; }
        public Builder createdAt(LocalDateTime v) { d.createdAt = v; return this; }
        public Builder totalOrders(int v) { d.totalOrders = v; return this; }
        public UserDto build() { return d; }
    }

    public Long getId() { return id; }
    public String getFirstName() { return firstName; }
    public String getLastName() { return lastName; }
    public String getEmail() { return email; }
    public String getPhone() { return phone; }
    public String getAddress() { return address; }
    public String getAvatar() { return avatar; }
    public Role getRole() { return role; }
    public boolean isEnabled() { return enabled; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public int getTotalOrders() { return totalOrders; }
}
