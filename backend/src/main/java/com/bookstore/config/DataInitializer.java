package com.bookstore.config;

import com.bookstore.entity.*;
import com.bookstore.repository.BookRepository;
import com.bookstore.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final BookRepository bookRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, BookRepository bookRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.bookRepository = bookRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            seedUsers();
            seedBooks();
            log.info("Sample data initialized successfully");
        }
    }

    private void seedUsers() {
        userRepository.saveAll(List.of(
            User.builder().firstName("Admin").lastName("User").email("admin@bookstore.com")
                .password(passwordEncoder.encode("admin123")).role(Role.ADMIN).enabled(true).build(),
            User.builder().firstName("John").lastName("Doe").email("john@example.com")
                .password(passwordEncoder.encode("user123")).role(Role.USER).enabled(true).build(),
            User.builder().firstName("Jane").lastName("Smith").email("jane@example.com")
                .password(passwordEncoder.encode("user123")).role(Role.USER).enabled(true).build()
        ));
    }

    private void seedBooks() {
        bookRepository.saveAll(List.of(
            book("The Great Gatsby", "F. Scott Fitzgerald", "A story of the mysteriously wealthy Jay Gatsby and his love for Daisy Buchanan.", "12.99", "18.99", "Fiction", "https://covers.openlibrary.org/b/id/8225261-L.jpg", 50, 4.5, 1250, true),
            book("To Kill a Mockingbird", "Harper Lee", "The unforgettable novel of a childhood in a sleepy Southern town.", "10.99", "15.99", "Fiction", "https://covers.openlibrary.org/b/id/8231856-L.jpg", 35, 4.8, 2100, true),
            book("1984", "George Orwell", "A rare work that grows more haunting as its futuristic purgatory becomes more real.", "9.99", "14.99", "Dystopian", "https://covers.openlibrary.org/b/id/8575708-L.jpg", 60, 4.7, 3200, true),
            book("The Alchemist", "Paulo Coelho", "A novel about following your dreams and listening to your heart.", "11.99", "16.99", "Fiction", "https://covers.openlibrary.org/b/id/8709920-L.jpg", 45, 4.6, 1800, true),
            book("Sapiens", "Yuval Noah Harari", "A Brief History of Humankind.", "14.99", "22.99", "Non-Fiction", "https://covers.openlibrary.org/b/id/9255566-L.jpg", 40, 4.4, 2500, true),
            book("Atomic Habits", "James Clear", "An Easy and Proven Way to Build Good Habits and Break Bad Ones.", "16.99", "24.99", "Self-Help", "https://covers.openlibrary.org/b/id/10521270-L.jpg", 55, 4.8, 4100, true),
            book("The Psychology of Money", "Morgan Housel", "Timeless lessons on wealth, greed, and happiness.", "15.99", "21.99", "Finance", "https://covers.openlibrary.org/b/id/10521271-L.jpg", 30, 4.7, 1900, true),
            book("Clean Code", "Robert C. Martin", "A Handbook of Agile Software Craftsmanship.", "39.99", "54.99", "Technology", "https://covers.openlibrary.org/b/id/8091016-L.jpg", 25, 4.6, 3100, false),
            book("Design Patterns", "Gang of Four", "Elements of Reusable Object-Oriented Software.", "44.99", "59.99", "Technology", "https://covers.openlibrary.org/b/id/8091017-L.jpg", 20, 4.5, 2800, false),
            book("The Lean Startup", "Eric Ries", "How Entrepreneurs Use Continuous Innovation to Create Successful Businesses.", "17.99", "25.99", "Business", "https://covers.openlibrary.org/b/id/8091018-L.jpg", 35, 4.3, 1600, false),
            book("Harry Potter and the Sorcerer's Stone", "J.K. Rowling", "The first magical adventure of Harry Potter at Hogwarts.", "13.99", "19.99", "Fantasy", "https://covers.openlibrary.org/b/id/10110415-L.jpg", 70, 4.9, 5200, true),
            book("The Hunger Games", "Suzanne Collins", "In a dystopian future, Katniss Everdeen is forced to compete in the deadly Hunger Games.", "12.99", "17.99", "Dystopian", "https://covers.openlibrary.org/b/id/8228691-L.jpg", 45, 4.5, 2900, false)
        ));
    }

    private Book book(String title, String author, String desc, String price, String origPrice,
                      String category, String imgUrl, int stock, double rating, int reviews, boolean featured) {
        return Book.builder().title(title).author(author).description(desc)
                .price(new BigDecimal(price)).originalPrice(new BigDecimal(origPrice))
                .category(category).imageUrl(imgUrl).stockQuantity(stock)
                .rating(rating).reviewCount(reviews).featured(featured).active(true).build();
    }
}
