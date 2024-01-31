import { Author } from "../author/author";

export interface Review {
    author: Author;
    rating: number;
    date: string;
    overview: string;
}