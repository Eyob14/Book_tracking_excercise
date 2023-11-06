from dataclasses import dataclass
@dataclass
class Book:
    id: int  # The unique identifier of the book
    title: str  # The title of the book
    status: str  # The status of the book (e.g., "to_be_read", "in_progress", "completed")
