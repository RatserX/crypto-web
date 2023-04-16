import { writable } from "svelte/store";

// Input
export const inputStore = writable("");

// Options
const createOptionsStore = () => {
    const initialValue = {
        aesMode: "CBC",
        aesPadding: "Pkcs7",
        key: null,
        pbkdf2Iterations: -1,
        pbkdf2KeySize: -1,
        rc4DropDrop: 768,
        sha3OutputLength: 512,
        standard: null
    };

    const { set, subscribe } = writable(initialValue);
    return {
        reset: () => set(initialValue),
        set,
        subscribe
    };
}

export const optionsStore = createOptionsStore();

export const actionStore = writable(null);
export const aesModeStore = writable("CBC");
export const aesPaddingStore = writable("Pkcs7");
export const functionStore = writable(null);
export const pbkdf2IterationsStore = writable(-1);
export const pbkdf2KeySizeStore = writable(-1);
export const rc4DropDropStore = writable(768);
export const sha3OutputLengthStore = writable(512);

// Output
export const outputStore = writable(null);
