/* global beforeEach, expect, test */
import '@testing-library/jest-dom';

import { act, fireEvent, render, screen } from '@testing-library/svelte';
import CryptoJS from 'crypto-js';
import { describe } from 'vitest';

import { inputState } from '../stores/input-store';
import { dataState } from '../stores/options-store';
import {
  AES_MODE,
  AES_PADDING,
  CIPHER_ALGORITHM,
  ENCODING,
  HASHING_ALGORITHM,
} from '../utils/constants';
import {
  getCryptoArguments,
  getRandomNumber,
  getRandomString,
} from '../utils/helpers';

import Layout from './Layout.svelte';

const message = getRandomString(100);

const createCiphersCases = () => {
  const aesModes = Object.values(AES_MODE);
  const aesPaddings = Object.values(AES_PADDING);
  const cipherAlgorithms = Object.values(CIPHER_ALGORITHM);
  const encodings = Object.values(ENCODING);

  const message = getRandomString(100);
  let cases = [];

  encodings.forEach((encoding) => {
    cipherAlgorithms.forEach((cipherAlgorithm) => {
      const data = {
        encoding,
        standard: cipherAlgorithm,
      };

      switch (cipherAlgorithm) {
        case CIPHER_ALGORITHM.aes: {
          aesModes.forEach((aesMode) => {
            aesPaddings.forEach((aesPadding) => {
              const additionalData = {
                ...data,
                aesMode: aesMode,
                aesPadding: aesPadding,
                key: getRandomString(5),
              };

              cases.push([additionalData, message]);
            });
          });

          break;
        }
        case CIPHER_ALGORITHM.des:
        case CIPHER_ALGORITHM.tripleDes:
        case CIPHER_ALGORITHM.rabbit:
        case CIPHER_ALGORITHM.rc4: {
          const additionalData = {
            ...data,
            key: getRandomString(5),
          };

          cases.push([additionalData, message]);
          break;
        }
        case CIPHER_ALGORITHM.rc4Drop: {
          const additionalData = {
            ...data,
            rc4DropDrop: getRandomNumber(100),
            key: getRandomString(5),
          };

          cases.push([additionalData, message]);
          break;
        }
        default: {
          cases.push([data, message]);
          break;
        }
      }
    });
  });

  return cases;
};

const createHashingCases = () => {
  const hashingAlgorithms = Object.values(HASHING_ALGORITHM);

  const message = getRandomString(100);
  let cases = [];

  hashingAlgorithms.forEach((hashingAlgorithm) => {
    const data = {
      standard: hashingAlgorithm,
    };

    switch (hashingAlgorithm) {
      case HASHING_ALGORITHM.sha3: {
        const additionalData = {
          ...data,
          sha3OutputLength: getRandomNumber(1000),
        };

        cases.push([additionalData, message]);
        break;
      }
      case HASHING_ALGORITHM.hmac: {
        const additionalData = {
          ...data,
          key: getRandomString(5),
        };

        cases.push([additionalData, message]);
        break;
      }
      case HASHING_ALGORITHM.pbkdf2: {
        const additionalData = {
          ...data,
          pbkdf2Iterations: getRandomNumber(100),
          pbkdf2KeySize: getRandomNumber(100),
          pbkdf2Salt: getRandomString(5),
        };

        cases.push([additionalData, message]);
        break;
      }
      default:
        cases.push([data, message]);
        break;
    }
  });

  return cases;
};

const getInput = () => {
  const inputTextarea = screen.getByRole('textbox', { name: /input/i });
  return inputTextarea.getAttribute('value');
};

const setInput = (value) => {
  const inputTextarea = screen.getByRole('textbox', { name: /input/i });
  inputTextarea.setAttribute('value', value);
};

beforeEach(() => {
  dataState.reset();
  inputState.reset();
});

test('testing', () => {
  console.log('test')
  console.log(createCiphersCases())
  console.log(createHashingCases())
})

describe('ciphers', () => {
  test.each(createCiphersCases())(
    '.encrypt(%o, %s)',
    (data, message) => {
      const parsedMessage = CryptoJS.enc[data.encoding].parse(message);
      const args = getCryptoArguments(data, parsedMessage);
      const encrypted = CryptoJS[data.standard]['encrypt'].apply(null, args);

      expect(encrypted).not.toThrow();
    }
  );
});

describe('hashing', () => {
  test.each(createHashingCases())(
    '.hash(%o, %s)',
    (data, message) => {
      const args = getCryptoArguments(data, message);
      const hashed = CryptoJS[data.standard].apply(null, args);

      expect(hashed.toString()).not.toThrow();
    }
  );

  test('MD5 hash output', async () => {
    render(Layout);

    const inputTextarea = screen.getByRole('textbox', { name: /input/i });
    act(() => fireEvent.input(inputTextarea, { target: { value: message } }));

    console.log('testestestsetset123');
    console.log(inputState.get());
    console.log(inputTextarea.value);

    setInput(message);
    dataState.update((data) => ({
      ...data,
      standard: HASHING_ALGORITHM.md5,
    }));

    const data = dataState.get();
    const input = getInput();
    const output = CryptoJS[data.standard](input);
    const hash = CryptoJS.MD5(message);

    expect(output.toString()).toBe(hash.toString());
  });

  test('MD5 validate output', async () => {
    render(Layout);
    setInput(message);
    dataState.update((data) => ({
      ...data,
      hash: '098f6bcd4621d373cade4e832627b4f6',
      standard: HASHING_ALGORITHM.md5,
    }));

    const data = dataState.get();
    const input = getInput();
    const output = CryptoJS[data.standard](input);

    expect(output.toString()).toBe(data.hash);
  });
});
