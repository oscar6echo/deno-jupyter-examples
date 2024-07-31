import { assert } from '@std/assert';
import { DOMParser } from 'linkedom';

const must_be_in = (value: string, possible_values: string[]) => {
  const msg = `value ${value} must be in ${possible_values}`;
  assert(possible_values.includes(value), msg);
};

const create_html_document = () => {
  const document = new DOMParser().parseFromString(
    `<!DOCTYPE html><html lang="en"></html>`,
    'text/html',
  );

  return document;
};

export { create_html_document, must_be_in };
