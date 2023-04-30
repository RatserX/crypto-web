/* global expect, test */
import '@testing-library/jest-dom';

import { act, fireEvent, render, screen } from '@testing-library/svelte';
import { describe } from 'vitest';

import { inputState } from '../stores/input-store';

import InputCard from './InputCard.svelte';

describe('input', () => {
  test('text updates states', async () => {
    render(InputCard);

    const inputTextarea = screen.getByRole('textbox', { name: /input/i });
    act(() => fireEvent.input(inputTextarea, { target: { value: 'test' } }));

    const input = inputState.get();
    expect(screen.getByDisplayValue(input)).toHaveValue('test');
  });
});
