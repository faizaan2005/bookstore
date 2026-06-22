package com.bookstore.repository;

import com.bookstore.entity.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Map;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {

    Page<Book> findByActiveTrue(Pageable pageable);

    @Query("SELECT b FROM Book b WHERE b.active = true AND " +
           "(LOWER(b.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(b.author) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<Book> searchBooks(@Param("query") String query, Pageable pageable);

    @Query("SELECT b FROM Book b WHERE b.active = true AND " +
           "(:category IS NULL OR b.category = :category) AND " +
           "(:query IS NULL OR LOWER(b.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(b.author) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<Book> findByFilters(@Param("query") String query, @Param("category") String category, Pageable pageable);

    List<Book> findByFeaturedTrueAndActiveTrueOrderByRatingDesc();

    List<Book> findTop8ByActiveTrueOrderByCreatedAtDesc();

    @Query("SELECT DISTINCT b.category FROM Book b WHERE b.active = true")
    List<String> findAllCategories();

    long countByActiveTrue();
    long countByStockQuantityEqualsAndActiveTrue(int stock);

    @Query("SELECT b.category, COUNT(b) FROM Book b GROUP BY b.category")
    List<Object[]> countByCategory();
}
