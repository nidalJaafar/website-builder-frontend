"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type SignInResult =
  | { success: true }
  | { success: false; message: string };

interface IAuthContext {
  isAuthenticated: boolean;
  isAuthenticating: boolean;
  signIn: (email: string, password: string) => Promise<SignInResult>;
  signOut: () => void;
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

const AUTH_STORAGE_KEY = "astrasite:auth";

const ACCESS_EMAIL =
  (process.env.NEXT_PUBLIC_AUTH_EMAIL || "devs@astrastieai.com").trim().toLowerCase();

const ACCESS_PASSWORD_HASH =
  (process.env.NEXT_PUBLIC_AUTH_PASSWORD_HASH ||
    "f8fea4fcba72a614958d9b2250ada5b8401c8ed593266a7a0b050ff326f1a749").trim().toLowerCase();

const bufferToHex = (buffer: ArrayBuffer) =>
  Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

// Lightweight SHA-256 fallback for environments without Web Crypto support.
// Adapted from https://geraintluff.github.io/sha256/ (public domain).
const sha256Fallback = (ascii: string) => {
  const rightRotate = (value: number, amount: number) =>
    (value >>> amount) | (value << (32 - amount));

  const mathPow = Math.pow;
  const maxWord = mathPow(2, 32);
  let result = "";

  const words: number[] = [];
  const asciiBitLength = ascii.length * 8;

  /**
   * Cache of computed constants.
   */
  const hash: number[] = [];
  const k: number[] = [];
  let primeCounter = 0;

  const isPrime = (candidate: number) => {
    const sqrt = Math.sqrt(candidate);
    for (let factor = 2; factor <= sqrt; factor += 1) {
      if (candidate % factor === 0) {
        return false;
      }
    }
    return true;
  };

  const getFractionalBits = (x: number) => ((x - Math.floor(x)) * maxWord) | 0;

  for (let candidate = 2; primeCounter < 64; candidate += 1) {
    if (!isPrime(candidate)) continue;
    if (primeCounter < 8) {
      hash[primeCounter] = getFractionalBits(Math.pow(candidate, 1 / 2));
    }
    k[primeCounter] = getFractionalBits(Math.pow(candidate, 1 / 3));
    primeCounter += 1;
  }

  let asciiIndex = 0;
  while (asciiIndex < ascii.length) {
    const code = ascii.charCodeAt(asciiIndex);
    if (code >> 8) {
      throw new Error("Invalid character detected, UTF-8 expected.");
    }
    const wordIndex = asciiIndex >> 2;
    words[wordIndex] = words[wordIndex] || 0;
    words[wordIndex] |= code << ((3 - asciiIndex) % 4) * 8;
    asciiIndex += 1;
  }

  const paddingIndex = asciiIndex >> 2;
  words[paddingIndex] = words[paddingIndex] || 0;
  words[paddingIndex] |= 0x80 << ((3 - asciiIndex) % 4) * 8;
  words[((asciiBitLength + 64 >> 9) << 4) + 15] = asciiBitLength;

  for (let j = 0; j < words.length;) {
    const w = words.slice(j, j += 16);
    const oldHash = hash.slice(0);

    for (let i = 0; i < 64; i += 1) {
      const w15 = w[i - 15] || 0;
      const w2 = w[i - 2] || 0;

      const s0 = rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3);
      const s1 = rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10);

      w[i] =
        w[i] ||
        (w[i - 16] + s0 + w[i - 7] + s1) | 0;

      const ch = (hash[4] & hash[5]) ^ (~hash[4] & hash[6]);
      const maj = (hash[0] & hash[1]) ^ (hash[0] & hash[2]) ^ (hash[1] & hash[2]);
      const sigma0 =
        rightRotate(hash[0], 2) ^ rightRotate(hash[0], 13) ^ rightRotate(hash[0], 22);
      const sigma1 =
        rightRotate(hash[4], 6) ^ rightRotate(hash[4], 11) ^ rightRotate(hash[4], 25);

      const t1 = (hash[7] + sigma1 + ch + k[i] + w[i]) | 0;
      const t2 = (sigma0 + maj) | 0;

      hash.pop();
      hash.unshift((t1 + t2) | 0);
      hash[4] = (hash[4] + t1) | 0;
    }

    for (let i = 0; i < 8; i += 1) {
      hash[i] = (hash[i] + oldHash[i]) | 0;
    }
  }

  for (let i = 0; i < 8; i += 1) {
    for (let shift = 3; shift >= 0; shift -= 1) {
      const value = (hash[i] >> (shift * 8)) & 0xff;
      result += ("0" + value.toString(16)).slice(-2);
    }
  }

  return result;
};

const hashPassword = async (password: string): Promise<string> => {
  if (typeof window !== "undefined" && window.crypto?.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const digest = await window.crypto.subtle.digest("SHA-256", data);
    return bufferToHex(digest);
  }

  return sha256Fallback(password);
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored === "1") {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Failed to read auth state from storage", error);
    }
  }, []);

  const signIn = useCallback(
    async (email: string, password: string): Promise<SignInResult> => {
      const normalizedEmail = email.trim().toLowerCase();
      const normalizedPassword = password.normalize("NFKC").trim();

      if (!normalizedEmail || !normalizedPassword) {
        return { success: false, message: "Email and password are required." };
      }

      if (normalizedEmail !== ACCESS_EMAIL) {
        return { success: false, message: "Invalid credentials." };
      }

      setIsAuthenticating(true);
      try {
        const hashed = (await hashPassword(normalizedPassword)).toLowerCase();
        if (hashed !== ACCESS_PASSWORD_HASH) {
          return { success: false, message: "Invalid credentials." };
        }

        setIsAuthenticated(true);
        window.localStorage.setItem(AUTH_STORAGE_KEY, "1");
        return { success: true };
      } catch (error) {
        console.error("Authentication failed", error);
        return {
          success: false,
          message: "Unable to verify credentials. Please try again.",
        };
      } finally {
        setIsAuthenticating(false);
      }
    },
    []
  );

  const signOut = useCallback(() => {
    setIsAuthenticated(false);
    try {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (error) {
      console.error("Failed to clear auth state from storage", error);
    }
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated,
      isAuthenticating,
      signIn,
      signOut,
    }),
    [isAuthenticated, isAuthenticating, signIn, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
