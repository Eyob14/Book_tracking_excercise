"""
Repository module for managing books in the database.

This module provides an interface for CRUD operations related to the Book model.
The BookRepository class interacts directly with the database, handling operations like:
- Creating a book record
- Retrieving all books
- Retrieving a specific book by its ID
- Deleting a book
- Updating book details

It also categorizes books based on their status (to_be_read, in_progress, completed).
"""

from model.book import Book # pylint: disable=import-error


class BookRepository:
    """
    Repository for managing CRUD operations on Book records in the database.
    """
    def __init__(self, db_connection):
        """
        Initialize the repository with a database connection.
        """
        self.db_connection = db_connection
        self.cursor = self.db_connection.cursor()
        self.cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS books (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title TEXT,
                status TEXT
            );
        """
        )
        self.db_connection.commit()

    def create_book(self, title, status):
        """
        Create a new book record in the database.
        """
        self.cursor.execute(
            "INSERT INTO books (title, status) VALUES (%s, %s)", (title, status)
        )
        self.db_connection.commit()
        book_id = self.cursor.lastrowid
        return Book(id=book_id, title=title, status=status)

    def get_all_books(self):
        """
        Retrieve all books categorized by their status.
        """
        self.cursor.execute("SELECT id, title, status FROM books")
        books = [
            Book(id=row[0], title=row[1], status=row[2])
            for row in self.cursor.fetchall()
        ]

        categorized_books = {"to_be_read": [], "in_progress": [], "completed": []}

        for book in books:
            book_data = {"id": book.id, "title": book.title, "status": book.status}

            if book.status == "to_be_read":
                categorized_books["to_be_read"].append(book_data)
            elif book.status == "in_progress":
                categorized_books["in_progress"].append(book_data)
            elif book.status == "completed":
                categorized_books["completed"].append(book_data)

        return categorized_books

    def get_book_by_id(self, book_id):
        """
        Retrieve a specific book by its ID.
        """
        self.cursor.execute(
            "SELECT id, title, status FROM books WHERE id=%s", (book_id,)
        )
        book = self.cursor.fetchone()
        if not book:
            return None
        return Book(id=book[0], title=book[1], status=book[2])

    def delete_book(self, book_id):
        """
        Delete a book record using its ID.
        """
        book = self.get_book_by_id(book_id)
        if not book:
            return None
        self.cursor.execute("DELETE FROM books WHERE id=%s", (book_id,))
        self.db_connection.commit()
        return book

    def update_book(self, book_id, title, status):
        """
        Update details of a specific book.
        """
        self.cursor.execute(
            "UPDATE books SET title=%s, status=%s WHERE id=%s", (title, status, book_id)
        )
        self.db_connection.commit()
        return Book(id=book_id, title=title, status=status)
