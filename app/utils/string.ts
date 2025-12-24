export const formatBytes = (bytes: number, decimals = 2) => {
  if (!+bytes) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = [
    'Bytes',
    'KiB',
    'MiB',
    'GiB',
    'TiB',
    'PiB',
    'EiB',
    'ZiB',
    'YiB',
  ];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / k ** i).toFixed(dm))}${sizes[i]}`;
};

/**
 * URL pathname에서 locale을 추출합니다.
 * @param pathname - URL의 pathname (예: '/en/about/greetings' 또는 '/about/greetings')
 * @returns 'en' 또는 'ko'
 */
export const getLocaleFromPathname = (pathname: string): 'en' | 'ko' => {
  return pathname.startsWith('/en') ? 'en' : 'ko';
};

// TODO: 필요한가??
export const encodeParam = (words: string) => words.replace(/\s+/g, '-');
export const decodeParam = (words: string) => words.replace(/-/g, ' ');
