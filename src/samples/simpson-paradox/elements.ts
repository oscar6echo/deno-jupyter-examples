import * as Plot from '@observablehq/plot';
import * as path from '@std/path';
import { display } from 'display';
import pl from 'nodejs-polars';
import { create_html_document, must_be_in } from '../../common/util.ts';

interface IPenguin {
  species: string;
  island: string;
  bill_length_mm: number;
  bill_depth_mm: number;
  flipper_length_mm: number;
  body_mass_g: number;
  sex: string;
}

const load_data = async (source: string = 'disk') => {
  must_be_in(source, ['disk', 'url']);

  let df: pl.DataFrame = pl.DataFrame();

  if (source === 'disk') {
    console.log(`load penguins from disk: ./data/penguins`);

    const filename = path.fromFileUrl(import.meta.url);
    const folder_here = path.dirname(filename);

    const folder_data = path.resolve(folder_here, '..', '..', '..', 'data');
    const path_file = path.resolve(folder_data, 'penguins.csv');

    df = pl.readCSV(path_file);
  } else if (source === 'url') {
    const url = 'https://raw.githubusercontent.com/mwaskom/seaborn-data/master/penguins.csv';
    console.log(`load penguins from url: ${url}`);

    const res = await fetch(url);
    const txt = await res.text();
    df = pl.readCSV(txt);
  }

  console.log('shape', df.shape);
  console.log('schema', df.schema);

  return df;
};

const plot = async (df: pl.DataFrame) => {
  const data = df.toRecords();
  const document = create_html_document();

  const p = Plot.plot({
    title: 'Simpson paradox',
    caption:
      'For each penguin species the bill depth increases with bill length, but it is the OPPOSITE for the whole population. Hence the paradox 🤔',
    grid: true,
    color: { legend: true },
    marks: [
      Plot.dot(data, { x: 'bill_length_mm', y: 'bill_depth_mm', fill: 'species' }),
      Plot.linearRegressionY(data, {
        x: 'bill_length_mm',
        y: 'bill_depth_mm',
        stroke: 'species',
      }),
      Plot.linearRegressionY(data, { x: 'bill_length_mm', y: 'bill_depth_mm' }),
    ],
    document,
  });

  return await display(p);
};

export { load_data, plot };
export type { IPenguin };
