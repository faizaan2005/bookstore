package com.bookstore.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.*;

@Entity
@Table(name = "app_users")
public class User implements UserDetails {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotBlank @Column(nullable = false) private String firstName;
    @NotBlank @Column(nullable = false) private String lastName;
    @Email @Column(nullable = false, unique = true) private String email;
    @Column(nullable = false) private String password;
    private String phone;
    private String address;
    private String avatar;
    @Enumerated(EnumType.STRING) @Column(nullable = false) private Role role = Role.USER;
    @Column(nullable = false) private boolean enabled = true;
    private String resetPasswordToken;
    private LocalDateTime resetPasswordExpiry;
    @Column(updatable = false) private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Order> orders = new ArrayList<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "user_wishlist",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "book_id"))
    private Set<Book> wishlist = new HashSet<>();

    @PrePersist protected void onCreate() { createdAt = LocalDateTime.now(); }
    @PreUpdate protected void onUpdate() { updatedAt = LocalDateTime.now(); }

    public User() {}

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final User u = new User();
        public Builder id(Long v) { u.id = v; return this; }
        public Builder firstName(String v) { u.firstName = v; return this; }
        public Builder lastName(String v) { u.lastName = v; return this; }
        public Builder email(String v) { u.email = v; return this; }
        public Builder password(String v) { u.password = v; return this; }
        public Builder phone(String v) { u.phone = v; return this; }
        public Builder address(String v) { u.address = v; return this; }
        public Builder avatar(String v) { u.avatar = v; return this; }
        public Builder role(Role v) { u.role = v; return this; }
        public Builder enabled(boolean v) { u.enabled = v; return this; }
        public User build() { return u; }
    }

    @Override public Collection<? extends GrantedAuthority> getAuthorities() { return List.of(new SimpleGrantedAuthority("ROLE_" + role.name())); }
    @Override public String getUsername() { return email; }
    @Override public String getPassword() { return password; }
    @Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isAccountNonLocked() { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled() { return enabled; }

    public Long getId() { return id; }
    public String getFirstName() { return firstName; }
    public String getLastName() { return lastName; }
    public String getEmail() { return email; }
    public String getPhone() { return phone; }
    public String getAddress() { return address; }
    public String getAvatar() { return avatar; }
    public Role getRole() { return role; }
    public String getResetPasswordToken() { return resetPasswordToken; }
    public LocalDateTime getResetPasswordExpiry() { return resetPasswordExpiry; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public List<Order> getOrders() { return orders; }
    public Set<Book> getWishlist() { return wishlist; }
    public String getFullName() { return firstName + " " + lastName; }

    public void setPassword(String v) { this.password = v; }
    public void setEnabled(boolean v) { this.enabled = v; }
    public void setResetPasswordToken(String v) { this.resetPasswordToken = v; }
    public void setResetPasswordExpiry(LocalDateTime v) { this.resetPasswordExpiry = v; }
    public void setAddress(String v) { this.address = v; }
    public void setPhone(String v) { this.phone = v; }
    public void setAvatar(String v) { this.avatar = v; }
}
