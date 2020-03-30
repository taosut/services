import { isArray, isBoolean } from 'util';
import { resolveOperand } from './resolveOperand';

export const resolveQueryFilter = (filter: any) => {
  const queries = [];
  if (isArray(filter)) {
    for (const iterator of filter) {
      const tmpQuery = generateQuery(iterator);

      if (tmpQuery) queries.push(tmpQuery);
    }
  } else {
    const tmpQuery = generateQuery(filter);

    if (tmpQuery) queries.push(tmpQuery);
  }

  const queryString = queries.join(' AND ');

  return queryString;
};

const generateQuery = (iterator: string) => {
  const queryFilters = iterator.split('||');

  if (queryFilters && queryFilters.length > 2) {
    const field = queryFilters[0];
    const operand = resolveOperand(queryFilters[1]);
    const value = queryFilters[2];

    if (isBoolean(value) || value === 'true') {
      return `${field}${operand}${value}`;
    }

    return `${field}${operand}'${value}'`;
  }

  return;
};
