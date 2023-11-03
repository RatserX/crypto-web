/* global expect, test */

import CryptoJS from 'crypto-js';
import { describe } from 'vitest';

import {
  AES_MODE,
  AES_PADDING,
  CIPHER_ALGORITHM,
  ENCODING,
  HASHING_ALGORITHM,
  HMAC_VARIANT,
  SHA2_VARIANT,
} from '../utils/constants';
import {
  getCryptoArguments,
  getRandomNumber,
  getRandomString,
} from '../utils/helpers';

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
  const hmacVariants = Object.values(HMAC_VARIANT);
  const sha2Variants = Object.values(SHA2_VARIANT);

  const message = getRandomString(100);
  let cases = [];

  hashingAlgorithms.forEach((hashingAlgorithm) => {
    const data = {
      standard: hashingAlgorithm,
    };

    switch (hashingAlgorithm) {
      case HASHING_ALGORITHM.sha2: {
        sha2Variants.forEach((sha2Variant) => {
          const additionalData = {
            ...data,
            standard: sha2Variant,
          };

          cases.push([additionalData, message]);
        });

        break;
      }
      case HASHING_ALGORITHM.sha3: {
        const additionalData = {
          ...data,
          sha3OutputLength: getRandomNumber(1000),
        };

        cases.push([additionalData, message]);
        break;
      }
      case HASHING_ALGORITHM.hmac: {
        hmacVariants.forEach((hmacVariant) => {
          const additionalData = {
            ...data,
            key: getRandomString(5),
            standard: hmacVariant,
          };

          cases.push([additionalData, message]);
        });

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

describe('the cipher algorithms', () => {
  test.each(createCiphersCases())('.decrypt(%o, %s)', (data, message) => {
    const args = getCryptoArguments(data, message);

    expect(() =>
      CryptoJS[data.standard]['decrypt'].apply(null, args),
    ).not.toThrowError();
  });

  test.each(createCiphersCases())('.encrypt(%o, %s)', (data, message) => {
    const parsedMessage = CryptoJS.enc[data.encoding].parse(message);
    const args = getCryptoArguments(data, parsedMessage);

    expect(() =>
      CryptoJS[data.standard]['encrypt'].apply(null, args),
    ).not.toThrowError();
  });
});

describe('the hashing algorithms', () => {
  test.each(createHashingCases())('.hash(%o, %s)', (data, message) => {
    const args = getCryptoArguments(data, message);
    expect(() => CryptoJS[data.standard].apply(null, args)).not.toThrow();
  });
});
