/**
 * Derives a set of keys from the master key.
 * @param {CryptoKey} material - master key to derive from
 *
 * See https://tools.ietf.org/html/draft-omara-sframe-00#section-4.3.1
 */
export async function deriveKeys(material) {
    const info = new ArrayBuffer();
    const textEncoder = new TextEncoder();

    const salt = textEncoder.encode('JFrameEncryptionKey');
    console.log("XXX salt", salt)
    // https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/deriveKey#HKDF
    // https://developer.mozilla.org/en-US/docs/Web/API/HkdfParams
    const encryptionKey = await crypto.subtle.deriveKey({
        name: 'HKDF',
        salt: salt,
        hash: 'SHA-256',
        info
    }, material, {
        name: 'AES-GCM',
        length: 128
    }, true, [ 'encrypt', 'decrypt' ]);

    const a = await crypto.subtle.exportKey("raw", encryptionKey);
    console.log("XXX see here key content", a);
    return {
        material,
        encryptionKey
    };
}

/**
 * Ratchets a key. See
 * https://tools.ietf.org/html/draft-omara-sframe-00#section-4.3.5.1
 * @param {CryptoKey} material - base key material
 * @returns {ArrayBuffer} - ratcheted key material
 */
export async function ratchet(material) {
}

/**
 * Converts a raw key into a WebCrypto key object with default options
 * suitable for our usage.
 * @param {ArrayBuffer} keyBytes - raw key
 * @param {Array} keyUsages - key usages, see importKey documentation
 * @returns {CryptoKey} - the WebCrypto key.
 */
export async function importKey(keyBytes) {
    // https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/importKey
    return crypto.subtle.importKey('raw', keyBytes, 'HKDF', false, [ 'deriveBits', 'deriveKey' ]);
}
