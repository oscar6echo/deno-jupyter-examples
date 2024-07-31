import * as path from '@std/path';
import { display } from 'display';
import d3 from '../../common/d3-bis.ts';
import { create_html_document } from '../../common/util.ts';

interface IDatum {
  letter: string;
  frequency: number;
}

interface IPlotOptions {
  darkMode?: boolean;
}

const load_data = async () => {
  console.log(`load alphabet.csv from disk`);

  const filename = path.fromFileUrl(import.meta.url);
  const folder_here = path.dirname(filename);
  const path_file = path.resolve(folder_here, 'alphabet.csv');

  const txt = await Deno.readTextFile(path_file);
  const data = d3.csvParse(txt) as unknown as IDatum[];
  console.log(data);

  return data;
};

const plot = async (data: IDatum[], options: IPlotOptions = {}) => {
  const { darkMode = true } = options;
  const axisColor = darkMode ? 'white' : 'black';

  const width = 800;
  const height = 400;
  const marginTop = 30;
  const marginRight = 0;
  const marginBottom = 30;
  const marginLeft = 40;

  // Declare the x (horizontal position) scale.
  const x = d3.scaleBand()
    .domain(d3.groupSort(data, ([d]) => -d.frequency, (d) => d.letter)) // descending frequency
    .range([marginLeft, width - marginRight])
    .padding(0.1);

  // Declare the y (vertical position) scale.
  const y = d3.scaleLinear()
    .domain([0, d3.max(data, (d) => d.frequency) ?? 1.0])
    .range([height - marginBottom, marginTop]);

  // Create the SVG container.
  const document = create_html_document();
  const rootSvg = d3.creator('svg').call(document.documentElement);

  const svg = d3.select(rootSvg)
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [0, 0, width, height])
    .attr('style', 'max-width: 100%; height: auto;');

  // Add a rect for each bar.
  svg.append('g')
    .attr('fill', 'steelblue')
    .selectAll()
    .data(data)
    .join('rect')
    .attr('x', (d) => x(d.letter) ?? 0)
    .attr('y', (d) => y(d.frequency))
    .attr('height', (d) => y(0) - y(d.frequency))
    .attr('width', x.bandwidth());

  // Add the x-axis and label.
  const gAxisBottom = svg.append('g')
    .attr('transform', `translate(0,${height - marginBottom})`);

  gAxisBottom
    // @ts-ignore: d3 flexibility breaks ts
    .call(d3.axisBottom(x).tickSizeOuter(0));

  gAxisBottom.selectAll('.domain').attr('stroke', axisColor);
  gAxisBottom.selectAll('.tick line').attr('stroke', axisColor);
  gAxisBottom.selectAll('.tick text').attr('fill', axisColor);
  gAxisBottom.selectAll('.tick path').attr('fill', axisColor);

  // Add the y-axis and label, and remove the domain line.
  const gAxisLeft = svg.append('g')
    .attr('transform', `translate(${marginLeft},0)`)
    // @ts-ignore: d3 flexibility breaks ts
    .call(d3.axisLeft(y).tickFormat((y) => (y * 100).toFixed()))
    .call((g) => g.select('.domain').remove())
    .call((g) =>
      g.append('text')
        .attr('x', -marginLeft)
        .attr('y', 10)
        .attr('fill', axisColor)
        .attr('text-anchor', 'start')
        .text('↑ Frequency (%)')
    );

  gAxisLeft.selectAll('line').attr('stroke', axisColor);
  gAxisLeft.selectAll('text').attr('fill', axisColor);
  gAxisLeft.selectAll('path').attr('fill', axisColor);

  return await display(rootSvg);
};

export { load_data, plot };
export type { IDatum, IPlotOptions };
