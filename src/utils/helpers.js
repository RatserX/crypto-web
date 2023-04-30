import CryptoJS from 'crypto-js';

import {
  CIPHER_ALGORITHM,
  HASHING_ALGORITHM,
  HMAC_VARIANT,
  SHA2_VARIANT,
} from './constants';

// CryptoJS
export const getAlgorithmFromStandard = (standard) => {
  const hmacVariants = Object.values(HMAC_VARIANT);
  const sha2Variants = Object.values(SHA2_VARIANT);

  if (hmacVariants.includes(standard)) return HASHING_ALGORITHM.hmac;
  else if (sha2Variants.includes(standard)) return HASHING_ALGORITHM.sha2;
  else return standard;
};

export const getCryptoArguments = (data, message) => {
  const algorithm = getAlgorithmFromStandard(data.standard);
  let cfg = {};

  switch (algorithm) {
    case HASHING_ALGORITHM.sha3:
      cfg = {
        outputLength: data.sha3OutputLength,
      };

      break;
    case HASHING_ALGORITHM.pbkdf2:
      cfg = {
        ...(data.pbkdf2Iterations >= 0 && {
          iterations: data.pbkdf2Iterations,
        }),
        ...(data.pbkdf2KeySize >= 0 && {
          keySize: data.pbkdf2KeySize,
        }),
      };

      break;
    case CIPHER_ALGORITHM.aes:
      cfg = {
        mode: CryptoJS.mode[data.aesMode],
        padding: CryptoJS.pad[data.aesPadding],
      };

      break;
    case CIPHER_ALGORITHM.rc4Drop:
      cfg = {
        drop: data.rc4DropDrop,
      };

      break;
    default:
      break;
  }

  let args = [];

  switch (algorithm) {
    case HASHING_ALGORITHM.hmac:
    case CIPHER_ALGORITHM.des:
    case CIPHER_ALGORITHM.tripleDes:
    case CIPHER_ALGORITHM.rabbit:
    case CIPHER_ALGORITHM.rc4:
      args = [message, data.key];
      break;
    case HASHING_ALGORITHM.sha3:
      args = [message, !isObjectEmpty(cfg) && cfg];
      break;
    case HASHING_ALGORITHM.pbkdf2:
      args = [message, data.pbkdf2Salt, !isObjectEmpty(cfg) && cfg];
      break;
    case CIPHER_ALGORITHM.aes:
    case CIPHER_ALGORITHM.rc4Drop:
      args = [message, data.key, !isObjectEmpty(cfg) && cfg];
      break;
    default:
      args = [message];
      break;
  }

  return args;
};

// Object
export const isObjectEmpty = (o) => Object.keys(o).length === 0;

// Random
export const getRandomNumber = (max, min = 0, inclusive = false) => {
  const inclusiveness = +inclusive;
  max = Math.floor(max);
  min = Math.ceil(min);

  return Math.floor(Math.random() * (max - min + inclusiveness) + min);
};

export const getRandomString = (arrayLength) =>
  Array(arrayLength)
    .fill()
    .map((_) => ((Math.random() * 36) | 0).toString(36))
    .join('');
