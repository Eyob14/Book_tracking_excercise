import { Book } from '@/models/book'
import React from 'react'
import { Button } from './ui/button'

type ListItemProp = {
    book: Book;
    index: number;
    onDelete: () => void;
    onMove: (source: string, destination: string, index: number) => void;
}

function ListItem({ book, onDelete, onMove, index }: ListItemProp) {
    return (
        <div
            className="p-4 bg-white border rounded shadow flex items-center justify-between"
        >
            <div className="flex-1 ml-4 mr-4 overflow-hidden">
                <span className="whitespace-pre-wrap break-words">{book.title}</span>
            </div>
            <details className="relative group mr-4">
                <summary className="cursor-pointer p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    Move
                </summary>
                <div className="absolute z-10 bg-white shadow-md mt-2 rounded w-32">
                    {["to_be_read", "in_progress", "completed"]
                        .filter(status => status !== book.status)
                        .map(status => (
                            <Button
                                key={status}
                                className="w-full text-left px-4 py-3 my-1 hover:bg-blue-500 rounded"
                                onClick={() => onMove(book.status, status, index)}
                                variant="outline"
                            >
                                {status.replace('_', ' ')}
                            </Button>
                        ))}
                </div>
            </details>
            <Button
                onClick={() => onDelete()}
                className="ml-4 p-2 bg-red-500 text-white rounded hover:bg-red-600"
                variant="outline"
            >
                Delete
            </Button>
        </div>
    )
}

export default ListItem