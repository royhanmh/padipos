export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;
export const MAX_LIMIT = 100;

const createBadRequestError = (message) => {
  const error = new Error(message);
  error.status = 400;
  return error;
};

const parsePositiveInteger = (value, label) => {
  if (value === undefined) {
    return undefined;
  }

  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw createBadRequestError(`${label} must be a positive integer.`);
  }

  return parsed;
};

export const parsePaginationQuery = (query = {}) => {
  const hasPage = query.page !== undefined;
  const hasLimit = query.limit !== undefined;

  if (!hasPage && !hasLimit) {
    return {
      enabled: false,
    };
  }

  const page = parsePositiveInteger(query.page, "page") ?? DEFAULT_PAGE;
  const limit = parsePositiveInteger(query.limit, "limit") ?? DEFAULT_LIMIT;

  if (limit > MAX_LIMIT) {
    throw createBadRequestError(`limit must not exceed ${MAX_LIMIT}.`);
  }

  return {
    enabled: true,
    page,
    limit,
    offset: (page - 1) * limit,
  };
};

export const buildPaginatedResponse = ({ rows, count, page, limit }) => {
  const totalItems = Number(count) || 0;
  const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / limit);

  return {
    data: rows,
    meta: {
      page,
      limit,
      total_items: totalItems,
      total_pages: totalPages,
      has_next_page: totalPages > 0 && page < totalPages,
      has_previous_page: page > 1 && totalPages > 0,
    },
  };
};
