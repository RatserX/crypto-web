import { tick } from 'svelte';
import { fireEvent, screen } from '@testing-library/svelte';

// Object
export const isObjectEmpty = (o) => Object.keys(o).length === 0;
