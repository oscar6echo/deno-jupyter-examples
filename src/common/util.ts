import { assert } from '@std/assert';
import { DOMParser } from 'linkedom';
import d3 from './d3-bis.ts';

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

const format_date = d3.utcFormat('%Y-%m-%d');
const parse_date = d3.utcParse('%Y-%m-%d');

const format_duration = d3.format(',.2f');

export { create_html_document, format_date, format_duration, must_be_in, parse_date };
