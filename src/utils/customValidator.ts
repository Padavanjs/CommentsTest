import { JSDOM } from 'jsdom';
import * as DOMPurify from 'dompurify';

export const cleaningText = (text: string): string => {
  const window = new JSDOM('').window;
  const purify = DOMPurify(window);
  const config = {
    ALLOWED_TAGS: ['a', 'code', 'strong', 'i'],
    ADD_ATTR: ['href', 'title'],
  };
  return purify.sanitize(text, config);
};
