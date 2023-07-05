import jscookie from "js-cookie";
export type LocalCookieKeys = "theme" | "consent"|"pb_auth";

export type ConsentList = "theme" | "authentication";

export interface ConsentCookie {
  accepted: boolean;
  consent_list: ConsentList[];
}
export type ThemeCookie = "light" | "dark";

export function getSavedCookies() {
  return {
    theme: getLocalCookie("theme") as ThemeCookie | undefined,
    consent: JSON.parse(getLocalCookie("consent") ?? "{}") as
      | ConsentCookie
      | undefined,
  };
}

export function getLocalCookie(key: LocalCookieKeys) {
  return jscookie.get(key);
}

export function setLocalCookie(key: LocalCookieKeys, value: string) {
  return jscookie.set(key, value);
}

export function acceptCookies() {
  const consent_cookie = {
    accepted: true,
    consent_list: ["theme", "authentication","pb_auth"],
  };
  setLocalCookie("consent", JSON.stringify(consent_cookie));
}

export function rejectCookies() {
  jscookie.remove("consent");
  jscookie.remove("theme");
  jscookie.remove("pb_auth");
}

export function canUseCookies() {
  const consent_cookie = JSON.parse(getLocalCookie("consent") ?? "{}") as
    | ConsentCookie
    | undefined;
  return consent_cookie?.accepted;
}
