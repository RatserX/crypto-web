/* global beforeEach, expect, test */
import '@testing-library/jest-dom';

import { fireEvent, render, screen } from '@testing-library/svelte';
import CryptoJS from 'crypto-js';
import { tick } from 'svelte';

import { inputState } from '../stores/input-store';
import { dataState } from '../stores/options-store';
import { outputState } from '../stores/output-store';
import { HASHING_ALGORITHM } from '../utils/constants';

import Layout from './Layout.svelte';

beforeEach(() => {
  dataState.reset();
  inputState.set('test');
});

test('MD5 output', async () => {
  render(Layout);

  const algorithmSelect = screen.getByRole('combobox', { name: /algorithm/i });
  fireEvent.change(algorithmSelect, {
    target: { value: HASHING_ALGORITHM.hmac },
  });

  await tick();

  //const variantSelect = screen.getByRole("combobox", { name: /variant/i });
  //fireEvent.change(algorithmSelect, { target: { value: HMAC_VARIANT.hmacMd5 } });

  await tick();

  const hashButton = screen.getByRole('button', { name: /hash/i });
  fireEvent.click(hashButton);

  const input = inputState.get();
  const output = outputState.get();
  const hash = CryptoJS.MD5(input);

  expect(output).toBe(hash.toString());
});

// Note: This is as an async test as we are using `fireEvent`
/*test('changes button text on click', async () => {
  console.log(dataState.get());
  dataState.update((value) => ({
    ...value,
    standard: 'SHA1',
  }));
  render(Layout);
  console.log(dataState.get());
  // Using await when firing events is unique to the svelte testing library because
  // we have to wait for the next `tick` so that Svelte flushes all pending state changes.
});*/
