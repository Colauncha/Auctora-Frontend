function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

function setCookie(name, value, days = 365, options = {}) {
  let cookieStr = `${encodeURIComponent(name)}=${encodeURIComponent(
    value,
  )}; path=/`;

  if (days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    cookieStr += `; expires=${expires.toUTCString()}`;
  }

  if (options.secure) {
    cookieStr += '; Secure';
  }
  if (options.sameSite) {
    cookieStr += `; SameSite=${options.sameSite}`;
  }

  document.cookie = cookieStr;
}

export { getCookie, setCookie };
