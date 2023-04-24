import { get, writable } from 'svelte/store';

const createData = () => {
  const initialValue = '';

  const data = writable(initialValue);
  return {
    ...data,
    get: () => get(data),
    reset: () => data.set(initialValue),
  };
};

export const outputState = createData();
