import CryptoJS from "crypto-js";

export default class session
{
    static keyValue = import.meta.env.VITE_CRYPTO_SECRET_KEY
    static ivKey = import.meta.env.VITE_CRYPTO_IV_KEY

    static getKey(key) {
        return `${import.meta.env.VITE_STORE_KEY}`+ '_'+ `${key}`.toUpperCase();
    }

    static objToStr(obj)
    {
        return JSON.stringify(obj);
    }

    static encrypt(data) {
      if (data) {
        const key = CryptoJS.PBKDF2(session.keyValue, 'salt', { keySize: 256/32, iterations: 100 });
        const iv = CryptoJS.enc.Utf8.parse(session.ivKey); // Convert string to WordArray
        const encrypted = CryptoJS.AES.encrypt(data, key, { iv: iv, mode: CryptoJS.mode.CBC });
        return encrypted.ciphertext.toString(CryptoJS.enc.Hex);
      }
    }

    static decrypt(data) {
      if (data) {
        const key = CryptoJS.PBKDF2(session.keyValue, 'salt', { keySize: 256/32, iterations: 100 });
        const iv = CryptoJS.enc.Utf8.parse(session.ivKey);
        const decrypted = CryptoJS.AES.decrypt({ ciphertext: CryptoJS.enc.Hex.parse(data) }, key, { iv: iv, mode: CryptoJS.mode.CBC });
        return decrypted.toString(CryptoJS.enc.Utf8);
      }
    }

    static setItem(key, value) {
        key = session.encrypt(session.getKey(key));
        if (value === undefined || value == null)
            sessionStorage.removeItem(key);
        else {
            sessionStorage.setItem(key, session.encrypt(value));
        }
    }
    static getItem(key) {
        let value = sessionStorage.getItem(session.encrypt(session.getKey(key)));
        if (value === undefined || value == null)
            return null;

        return session.decrypt(sessionStorage.getItem(session.encrypt(session.getKey(key))));
    }
}
