export const HASHING_ALGORITHM = {
    md5: 'MD5',
    sha1: 'SHA1',
    sha2: 'SHA2',
    sha3: 'SHA3',
    ripemd160: 'RIPEMD160',
    hmac: 'HMAC',
    pbkdf2: 'PBKDF2'
};

export const CYPHER_ALGORITHM = {
    aes: 'AES',
    des: 'DES',
    tripleDes: 'TripleDES',
    rabbit: 'Rabbit',
    rc4: 'RC4',
    rc4Drop: 'RC4Drop'
};

export const HMAC_VARIANT = {
    hmacMd5: 'HmacMD5',
    hmacRipemd160: 'HmacRIPEMD160',
    hmacSha1: 'HmacSHA1',
    hmacSha224: 'HmacSHA224',
    hmacSha256: 'HmacSHA256',
    hmacSha3: 'HmacSHA3',
    hmacSha384: 'HmacSHA384',
    hmacSha512: 'HmacSHA512'
};

export const SHA2_VARIANT = {
    sha224: 'SHA224',
    sha256: 'SHA256',
    sha384: 'SHA384',
    sha512: 'SHA512'
};

export const AES_MODE = {
    cbc: 'CBC',
    cfb: 'CFB',
    ctr: 'CTR',
    ofb: 'OFB',
    ecb: 'ECB'
};

export const AES_PADDING = {
    pkcs7: 'Pkcs7',
    iso97971: 'Iso97971',
    ansiX923: 'AnsiX923',
    iso10126: 'Iso10126',
    zeroPadding: 'ZeroPadding',
    noPadding: 'NoPadding'
};

export const ENCODING = {
    base64: 'Base64',
    base64url: 'Base64url',
    hex: 'Hex',
    latin1: 'Latin1',
    utf8: 'Utf8',
    utf16: 'Utf16',
    utf16BE: 'Utf16BE',
    utf16LE: 'Utf16LE'
};
