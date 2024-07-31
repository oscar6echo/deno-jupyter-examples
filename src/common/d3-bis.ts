// @ts-types='@types/d3-selection';
import * as d3_selection from 'd3-selection';

// @ts-types='npm:@types/d3-array';
import * as d3_array from 'd3-array';

// @ts-types='npm:@types/d3-geo';
import * as d3_geo from 'd3-geo';

// @ts-types='npm:@types/d3-time';
import * as d3_time from 'd3-time';

// @ts-types='npm:@types/d3-dsv';
import * as d3_dsv from 'd3-dsv';

// @ts-types='npm:@types/d3-scale';
import * as d3_scale from 'd3-scale';

// @ts-types='npm:@types/d3-axis';
import * as d3_axis from 'd3-axis';

const d3 = {
  ...d3_selection,
  ...d3_array,
  ...d3_geo,
  ...d3_time,
  ...d3_dsv,
  ...d3_scale,
  ...d3_axis,
};

export default d3;
