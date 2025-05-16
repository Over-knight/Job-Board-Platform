import { Request } from "express";

export function parsePagination (req: Request) {
    const page = Math.max(parseInt(String(req.query.page), 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(String(req.query.limit), 10) || 10, 1), 100);
    const skip = (page - 1)* limit;
    return {page, limit, skip};
}

export function parseSort (req: Request)  {
    // default sort: postedAt descending
    const raw = String(req.query.sort || 'postedAt:desc');
    const [field, order] = raw.split(':');
    // ensure order is either 'asc' or 'desc'
    const dir = order === 'asc' ? 'asc' : 'desc';
    return { field: field as keyof typeof req.query, order: dir };
  }
  