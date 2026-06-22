package com.bookstore.service;

import com.bookstore.dto.BookDto;
import com.bookstore.entity.Book;
import com.bookstore.exception.ResourceNotFoundException;
import com.bookstore.repository.BookRepository;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class BookService {

    private final BookRepository bookRepository;

    public BookService(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    public Page<BookDto> getBooks(String query, String category, String sortBy, int page, int size) {
        Sort sort = switch (sortBy) {
            case "price_asc" -> Sort.by("price").ascending();
            case "price_desc" -> Sort.by("price").descending();
            case "rating" -> Sort.by("rating").descending();
            case "newest" -> Sort.by("createdAt").descending();
            default -> Sort.by("title").ascending();
        };
        Pageable pageable = PageRequest.of(page, size, sort);
        boolean noQuery = query == null || query.isBlank();
        boolean noCat = category == null || category.isBlank();
        if (noQuery && noCat) return bookRepository.findByActiveTrue(pageable).map(this::mapToDto);
        return bookRepository.findByFilters(noQuery ? null : query, noCat ? null : category, pageable).map(this::mapToDto);
    }

    public BookDto getBookById(Long id) {
        return bookRepository.findById(id)
                .map(this::mapToDto)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with id: " + id));
    }

    public List<BookDto> getFeaturedBooks() {
        return bookRepository.findByFeaturedTrueAndActiveTrueOrderByRatingDesc().stream().map(this::mapToDto).toList();
    }

    public List<BookDto> getNewArrivals() {
        return bookRepository.findTop8ByActiveTrueOrderByCreatedAtDesc().stream().map(this::mapToDto).toList();
    }

    public List<String> getCategories() {
        return bookRepository.findAllCategories();
    }

    @Transactional
    public BookDto createBook(BookDto dto) {
        return mapToDto(bookRepository.save(mapToEntity(dto)));
    }

    @Transactional
    public BookDto updateBook(Long id, BookDto dto) {
        Book book = bookRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Book not found"));
        updateEntityFromDto(book, dto);
        return mapToDto(bookRepository.save(book));
    }

    @Transactional
    public void deleteBook(Long id) {
        Book book = bookRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Book not found"));
        book.setActive(false);
        bookRepository.save(book);
    }

    public BookDto mapToDto(Book book) {
        return BookDto.builder()
                .id(book.getId()).title(book.getTitle()).author(book.getAuthor())
                .description(book.getDescription()).price(book.getPrice()).originalPrice(book.getOriginalPrice())
                .category(book.getCategory()).isbn(book.getIsbn()).publisher(book.getPublisher())
                .language(book.getLanguage()).pages(book.getPages()).imageUrl(book.getImageUrl())
                .stockQuantity(book.getStockQuantity()).rating(book.getRating()).reviewCount(book.getReviewCount())
                .featured(book.isFeatured()).active(book.isActive()).inStock(book.isInStock()).build();
    }

    private Book mapToEntity(BookDto dto) {
        return Book.builder().title(dto.getTitle()).author(dto.getAuthor()).description(dto.getDescription())
                .price(dto.getPrice()).originalPrice(dto.getOriginalPrice()).category(dto.getCategory())
                .isbn(dto.getIsbn()).publisher(dto.getPublisher()).language(dto.getLanguage())
                .pages(dto.getPages()).imageUrl(dto.getImageUrl()).stockQuantity(dto.getStockQuantity() != null ? dto.getStockQuantity() : 0)
                .rating(dto.getRating() != null ? dto.getRating() : 0.0)
                .reviewCount(dto.getReviewCount() != null ? dto.getReviewCount() : 0)
                .featured(dto.isFeatured()).active(true).build();
    }

    private void updateEntityFromDto(Book book, BookDto dto) {
        book.setTitle(dto.getTitle()); book.setAuthor(dto.getAuthor()); book.setDescription(dto.getDescription());
        book.setPrice(dto.getPrice()); book.setOriginalPrice(dto.getOriginalPrice()); book.setCategory(dto.getCategory());
        book.setIsbn(dto.getIsbn()); book.setPublisher(dto.getPublisher()); book.setLanguage(dto.getLanguage());
        book.setPages(dto.getPages()); book.setImageUrl(dto.getImageUrl());
        book.setStockQuantity(dto.getStockQuantity() != null ? dto.getStockQuantity() : 0);
        book.setFeatured(dto.isFeatured()); book.setActive(dto.isActive());
    }
}
