"""
This module provides an interface for CRUD (Create, Read, Update, Delete) operations related to the Book model.
The BookRepository class interacts directly with the database to handle the following operations:
- Creating a new book record in the database.
- Retrieving all books categorized by their status (to_be_read, in_progress, completed).
- Retrieving a specific book by its ID.
- Deleting a book record from the database using its ID.

The BookRepository class is initialized with a database connection and provides methods to interact with the books table in the database. It uses the Book model to represent book records.

The BookRepository class also categorizes books based on their status and returns them as a dictionary with three keys: "to_be_read", "in_progress", and "completed". Each key maps to a list of book objects that have the corresponding status.

To use this module, create an instance of the BookRepository class with a database connection and call its methods to perform CRUD operations on book records in the database.
"""
from model.book import Book


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
        self._create_table_if_not_exists()

    def _create_table_if_not_exists(self):
        """
        Create the 'books' table if it does not exist.
        """
        create_table_query = """
            CREATE TABLE IF NOT EXISTS books (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title TEXT,
                status TEXT
            );
        """
        self.cursor.execute(create_table_query)
        self.db_connection.commit()

    def create_book(self, title, status):
        """
        Create a new book record in the database.
        """
        insert_query = "INSERT INTO books (title, status) VALUES (%s, %s)"
        self.cursor.execute(insert_query, (title, status))
        self.db_connection.commit()
        book_id = self.cursor.lastrowid
        return Book(id=book_id, title=title, status=status)

    def get_all_books(self):
        """
        Retrieve all books categorized by their status.
        """
        select_query = "SELECT id, title, status FROM books"
        self.cursor.execute(select_query)
        books = [Book(*row) for row in self.cursor.fetchall()]
        
        categorized_books = {"to_be_read": [], "in_progress": [], "completed": []}

        for book in books:
            book_data = {"id": book.id, "title": book.title, "status": book.status}
            categorized_books[book.status].append(book_data)

        return categorized_books

    def get_book_by_id(self, book_id):
        """
        Retrieve a specific book by its ID.
        """
        select_query = "SELECT id, title, status FROM books WHERE id=%s"
        self.cursor.execute(select_query, (book_id,))
        book = self.cursor.fetchone()
        
        if not book:
            return None
        
        return Book(*book)

    def delete_book(self, book_id):
        """
        Delete a book record using its ID.
        """
        book_to_delete = self.get_book_by_id(book_id)
        
        if not book_to_delete:
            return None
        
        delete_query = "DELETE FROM books WHERE id=%s"
        self.cursor.execute(delete_query, (book_id,))
        self.db_connection.commit()
        
        return book_to_delete

    def update_book(self, book_id, title, status):
        """
        Update details of a specific book.
        """
        update_query = "UPDATE books SET title=%s, status=%s WHERE id=%s"
        self.cursor.execute(update_query, (title, status, book_id))
        self.db_connection.commit()
        
        return Book(id=book_id, title=title, status=status)
