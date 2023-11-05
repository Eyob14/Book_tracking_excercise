import React from 'react'
import { Book } from '../models/book'
import ListItem from './list-item'

type ListBookSectionProps = {
    title: string;
    books: Book[];
    onDelete: (index: number) => void;
    onMove: (source: string, destination: string, index: number,) => void;
}

function ListBookSection({
    title,
    books,
    onDelete,
    onMove
}: ListBookSectionProps) {
    return (
        <div key={title}>
            <h2 className="text-xl mb-4">{title}</h2>
            {
                books.map((book, index) => (
                    <ListItem
                        key={book.id}
                        book={book}
                        index={index}
                        onDelete={() => onDelete(index)}
                        onMove={onMove}
                    />
                ))
            }
        </div>
    )
}

export default ListBookSection