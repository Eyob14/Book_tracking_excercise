"""
FastAPI application for managing books.

This module provides CRUD operations for books using FastAPI and a SQL database.
Endpoints support operations like creating, reading, updating, and deleting book records.
"""

import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from model.book import Book
from repository.book_repository import BookRepository
from db_util import get_db

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

APP_HOST = os.environ.get("APP_HOST")
DATABASE_CONNECTION = get_db()
repository = BookRepository(DATABASE_CONNECTION)


@app.post("/books", response_model=Book)
async def create_book(obj: dict):
    """
    Create a new book entry in the database.
    """
    title = obj["title"]
    status = obj["status"]
    return repository.create_book(title, status)


@app.get("/books", response_model=dict)
async def get_all_books():
    """
    Retrieve all book entries from the database.
    """
    return repository.get_all_books()


@app.get("/books/{book_id}", response_model=Book)
async def get_book_by_id(book_id: int):
    """
    Retrieve a specific book entry from the database by its ID.
    """
    book = repository.get_book_by_id(book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    return book


@app.put("/books", response_model=Book)
async def update_book(new_book: Book):
    """
    Update the details of a specific book entry in the database.
    """
    old_book = repository.get_book_by_id(new_book.id)
    if not old_book:
        raise HTTPException(status_code=404, detail="Book not found")
    return repository.update_book(new_book.id, new_book.title, new_book.status)


@app.delete("/books/{book_id}", response_model=Book)
async def delete_book(book_id: int):
    """
    Delete a specific book entry from the database by its ID.
    """
    book = repository.delete_book(book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    return book


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host=APP_HOST, port=8000)
