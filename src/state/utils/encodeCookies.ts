import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";

export function encodeCookie(cookie: { [key: string]: string }): string {
  let encodedCookie = "";
  for (const [key, value] of Object.entries(cookie)) {
    encodedCookie += `${encodeURIComponent(key)}=${encodeURIComponent(value)}; `;
  }
    return encodedCookie.trimEnd();
}

export function encodeNextPBCookie(next_cookie: RequestCookie | undefined) {
  if (!next_cookie) {
    return "";
  }

  const cookie = { pb_auth: next_cookie.value };
  let encodedCookie = "";
  for (const [key, value] of Object.entries(cookie)) {
    encodedCookie += `${encodeURIComponent(key)}=${encodeURIComponent(value)}; `;
  }

  return encodedCookie.trimEnd();
}

