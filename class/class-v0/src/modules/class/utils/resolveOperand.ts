export const resolveOperand = (value: string) => {
  const op = value.toLowerCase();
  if (op === 'eq') {
    return '=';
  }

  return;
};
