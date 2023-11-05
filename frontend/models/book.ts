export type Book = {
  id: number;
  title: string;
  status: string;
};

export type BooksData = {
  [key: string]: Book[];
};
