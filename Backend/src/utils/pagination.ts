import type { Request } from "express";

export function parsePagination(req: Request) {
  const _start = parseInt(req.query._start as string) || 0;
  const _end = parseInt(req.query._end as string) || 10;
  const _sort = (req.query._sort as string) || "createdAt";
  const _order = ((req.query._order as string) || "DESC").toLowerCase() as "asc" | "desc";

  return {
    skip: _start,
    take: _end - _start,
    orderBy: { [_sort]: _order },
  };
}

export function parseFilters(req: Request, allowedFields: string[]) {
  const where: Record<string, unknown> = {};

  for (const field of allowedFields) {
    const value = req.query[field];
    if (value !== undefined && value !== "") {
      where[field] = value;
    }
  }

  // Handle search with q parameter
  const q = req.query.q as string;
  if (q) {
    where.OR = allowedFields
      .filter((f) => typeof f === "string")
      .map((field) => ({
        [field]: { contains: q, mode: "insensitive" },
      }));
    // Remove individual field filters when doing full-text search
  }

  return where;
}
