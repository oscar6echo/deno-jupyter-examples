import solar from 'solar-calculator';
import d3 from '../../common/d3-bis.ts';
import { create_html_document, format_date } from '../../common/util.ts';

type Location = {
  latitude: number;
  longitude: number;
  timeZone: string;
};

const build_html = (location: Location) => {
  const _solar = solar([location.longitude, location.latitude]);

  const width = 700 + 28;
  const height = width;
  const formatHour = (d: Date) =>
    d.toLocaleString('en', { hour: 'numeric', timeZone: location.timeZone }) as string;
  const outline = d3.geoCircle().radius(90).center([0, 90])();
  const graticule = d3.geoGraticule().stepMinor([15, 10])();

  const projection = d3.geoStereographic()
    .reflectY(true)
    .scale((width - 120) * 0.5)
    .clipExtent([[0, 0], [width, height]])
    .rotate([0, -90])
    .translate([width / 2, height / 2])
    .precision(0.1);

  const path = d3.geoPath(projection);

  const document = create_html_document();
  const rootSvg = d3.creator('svg').call(document.documentElement);

  const svg = d3.select(rootSvg)
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [0, 0, width, height])
    .attr(
      'style',
      'display: block; margin: 0 -14px; width: 100%; height: auto; font: 10px sans-serif; background-color: white',
    )
    .attr('text-anchor', 'middle')
    .attr('fill', 'black');

  svg.append('path')
    .attr('d', path(graticule))
    .attr('fill', 'none')
    .attr('stroke', 'black')
    .attr('stroke-opacity', 0.2);

  svg.append('path')
    .attr('d', path(outline))
    .attr('fill', 'none')
    .attr('stroke', 'black');

  svg.append('g')
    .attr('stroke', 'black')
    .selectAll()
    .data(d3.range(360))
    .join('line')
    .datum((d: number) => [
      projection([d, 0]),
      projection([d, d % 10 ? -1 : -2]),
    ])
    // @ts-ignore: d3 flexibility breaks ts
    .attr('x1', ([[x1]]) => x1)
    .attr('x2', ([, [x2]]) => x2)
    .attr('y1', ([[, y1]]) => y1)
    .attr('y2', ([, [, y2]]) => y2);

  svg.append('g')
    .selectAll()
    .data(d3.range(0, 360, 10))
    .join('text')
    .attr('fill', 'black')
    .attr('dy', '0.35em')
    .text((d) => d === 0 ? 'N' : d === 90 ? 'E' : d === 180 ? 'S' : d === 270 ? 'W' : `${d}`)
    // .text((d) => d === 0 ? 'N' : d === 90 ? 'E' : d === 180 ? 'S' : d === 270 ? 'W' : `${d}°`)
    .attr('font-size', (d) => d % 90 ? null : 14)
    .attr('font-weight', (d) => d % 90 ? null : 'bold')
    .datum((d) => projection([d, -4]))
    // @ts-ignore: d3 flexibility breaks ts
    .attr('x', ([x]) => x)
    .attr('y', ([, y]) => y);

  svg.append('g')
    .selectAll()
    .data(d3.range(10, 91, 10)) // every 10°
    .join('text')
    .attr('fill', 'black')
    .attr('dy', '0.35em')
    .text((d) => `${d}`)
    // .text((d) => `${d}°`)
    .datum((d) => projection([180, d]))
    // @ts-ignore: d3 flexibility breaks ts
    .attr('x', (e) => e === null ? null : e[0]) // x
    .attr('y', (e) => e === null ? null : e[1]) // y
    .attr('x', ([x]) => x)
    .attr('y', ([, y]) => y);

  const sunPath = svg.append('path')
    .attr('fill', 'none')
    .attr('stroke', 'red')
    .attr('stroke-width', 2);

  const hour = svg.append('g')
    .selectAll()
    .data(d3.range(24))
    .join('g');

  hour.append('circle')
    .attr('fill', 'black')
    .attr('r', 2);

  hour.append('text')
    .attr('dy', '-0.4em')
    .attr('stroke', 'white')
    .attr('stroke-width', 4)
    .attr('stroke-linejoin', 'round')
    .attr('fill', 'none')
    .clone(true)
    .attr('stroke', null)
    .attr('fill', 'black');

  const x_pos = width - 60;
  const y_pos = 15;
  const dy = 14;

  svg.append('text')
    .attr('x', x_pos)
    .attr('y', y_pos + 0 * dy)
    .attr('text-anchor', 'start')
    .attr('fill', 'black')
    .text(`${location.timeZone}`);

  svg.append('text')
    .attr('x', x_pos)
    .attr('y', y_pos + 1 * dy)
    .attr('text-anchor', 'start')
    .attr('fill', 'black')
    .text(`lat:  ${location.latitude}`);

  svg.append('text')
    .attr('x', x_pos)
    .attr('y', y_pos + 2 * dy)
    .attr('text-anchor', 'start')
    .attr('fill', 'black')
    .text(`long: ${location.longitude}`);

  const tagDate = svg.append('text')
    .attr('x', 50)
    .attr('y', 15);

  rootSvg.update = (date: Date) => {
    const start = d3.utcHour.offset(_solar.noon(date), -12);
    const end = d3.utcHour.offset(start, 24);

    sunPath.attr(
      'd',
      path({ type: 'LineString', coordinates: d3.utcMinutes(start, end).map(_solar.position) }),
    );
    hour.data(d3.utcHours(start, end));
    hour.attr('transform', (d) => `translate(${projection(_solar.position(d))})`);
    // @ts-ignore: d3 flexibility breaks ts
    hour.select('text:first-of-type').text(formatHour);
    // @ts-ignore: d3 flexibility breaks ts
    hour.select('text:last-of-type').text(formatHour);

    tagDate.text(`${format_date(date)}`);

    return rootSvg.outerHTML;
  };

  return rootSvg;
};

export { build_html, type Location };
