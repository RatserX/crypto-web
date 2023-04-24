import { get, writable } from 'svelte/store';

const createData = () => {
  const initialValue = {
    aesMode: 'CBC',
    aesPadding: 'Pkcs7',
    encoding: 'Utf8',
    hash: '',
    key: '',
    pbkdf2Iterations: -1,
    pbkdf2KeySize: -1,
    pbkdf2Salt: '',
    rc4DropDrop: 768,
    sha3OutputLength: 512,
    standard: null,
  };

  const data = writable(initialValue);
  return {
    ...data,
    get: () => get(data),
    reset: () => data.set(initialValue),
  };
};

export const dataState = createData();
