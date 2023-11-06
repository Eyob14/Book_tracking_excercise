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
                <span className="whitespace-pre-wrap break-words text-lg capitalize">{book.title}</span>
            </div>
            <details className="relative group mr-4">
                <summary className="cursor-pointer p-2 bg-green-500 text-white rounded hover:bg-blue-600">
                    Move
                </summary>
                <div className="absolute z-10 bg-white shadow-md mt-2 rounded w-32">
                    {["to_be_read", "in_progress", "completed"]
                        .filter(status => status !== book.status)
                        .map(status => (
                            <Button
                                key={status}
                                className="w-full text-left px-4 py-3 my-1 hover:bg-green-500 rounded"
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
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
            </Button>
        </div>
    )
}

export default ListItem