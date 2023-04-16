import { writable } from "svelte/store";

const createData = () => {
    const initialValue = {
        aesMode: "CBC",
        aesPadding: "Pkcs7",
        hash: "",
        key: "",
        pbkdf2Iterations: -1,
        pbkdf2KeySize: -1,
        pbkdf2Salt: "",
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

export const dataState = createData();
