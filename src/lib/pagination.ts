export function paginate<T>(items: T[], requestedPage: number, pageSize: number) {
  const pages = Math.max(1, Math.ceil(items.length / pageSize))
  const page = Math.min(pages, Number.isSafeInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1)
  const start = (page - 1) * pageSize
  return { page, pages, start: items.length ? start + 1 : 0, end: Math.min(start + pageSize, items.length), items: items.slice(start, start + pageSize) }
}
