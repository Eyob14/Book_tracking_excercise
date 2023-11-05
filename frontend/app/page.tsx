"use client"

import { useState, useEffect } from "react";
import AddBookForm from "@/components/add-book-form";
import { BooksData } from "@/models/book";
import { useToast } from "@/components/ui/use-toast";
import { BASE_URL } from "@/utils/constants";
import ListBookSection from "@/components/list-book-section";


export default function Home() {
  const { toast } = useToast()

  const [books, setBooks] = useState<BooksData>({
    to_be_read: [],
    in_progress: [],
    completed: [],
  });
  const [isNewBookAdded, setIsNewBookAdded] = useState(false);

  const moveBook = async (
    source: string,
    destination: string,
    index: number,
  ) => {
    const sourceSection = books[source];
    const destinationSection = books[destination];
    const [removed] = sourceSection.splice(index, 1);
    if (!removed) return;
    removed.status = destination;
    destinationSection.push(removed);
    setBooks({
      ...books,
      [source]: sourceSection,
      [destination]: destinationSection,
    });
    const body = JSON.stringify({
      id: removed.id,
      title: removed.title,
      status: destination,
    });

    try {
      await fetch(`${BASE_URL}/books`, {
        headers: {
          "content-type": "application/json",
        },
        method: "PUT",
        body: body,
      });
    } catch (err) {
      toast({
        description: "Check your internet connection and try again later.",
      })

      removed.status = source;
      sourceSection.push(removed);
      destinationSection.pop();
      setBooks({
        ...books,
        [source]: sourceSection,
        [destination]: destinationSection,
      });

      return;
    }
  };
  const deleteBook = async (section: string, index: number) => {
    const source = books[section];
    const [removed] = source.splice(index, 1);
    if (!removed) return;
    setBooks({
      ...books,
      [section]: source,
    });

    let response;
    try {
      response = await fetch(`${BASE_URL}/books/${removed.id}`, {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
        },
      });
    } catch (err) {
      toast({
        description: "Could not connect to the server, please try again later.",
      })
      source.push(removed);
      setBooks({
        ...books,
        [section]: source,
      });
      return;
    }
    if (response.status !== 200) {
      toast({
        description: "Something went wrong",
      })
      return;
    }
    toast({
      description: "Book deleted successfully",
    })
  };

  useEffect(() => {
    const fetchData = async () => {
      let response;
      try {
        response = await fetch(`${BASE_URL}/books`, {
          cache: "no-cache",
          headers: {
            "content-type": "application/json",
          },
        });
      } catch (err) {
        toast({
          description: "Could not connect to the server, please try again later.",
        })
        return;
      }
      if (response.status !== 200) {
        toast({
          description: "Something went wrong, please try again later.",
        })
        return;
      }
      const data = await response.json();
      setBooks(data);
    };

    fetchData();
  }, [isNewBookAdded]);


  return (
    <main className="flex flex-col justify-between p-24 gap-10">
      <AddBookForm setIsNewBookAdded={setIsNewBookAdded} />

      <div className="flex justify-between p-10 gap-10">
        {/* to-read Column */}
        <div className="w-1/3 p-4 border bg-red-50 rounded">
          <ListBookSection
            title="To Be Read"
            books={books.to_be_read}
            onDelete={(index: number) => deleteBook("to_be_read", index)}
            onMove={moveBook}
          />
        </div>
        {/* in_progress Column */}
        <div className="w-1/3 p-4 border bg-yellow-50 rounded">
          <ListBookSection
            title="In progress"
            books={books.in_progress}
            onDelete={(index: number) => deleteBook("in_progress", index)}
            onMove={moveBook}
          />
        </div>

        {/* Completed Column */}
        <div className="w-1/3 p-4 border bg-green-50 rounded">
          <ListBookSection
            title="Completed"
            books={books.completed}
            onDelete={(index: number) => deleteBook("completed", index)}
            onMove={moveBook}
          />
        </div>
      </div>
    </main>
  )
}
