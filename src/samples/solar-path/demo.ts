import { sleep } from 'sleep';
import d3 from '../../common/d3-bis.ts';
import { format_duration } from '../../common/util.ts';
import { build_html, Location } from './elements.ts';

// deno-lint-ignore no-explicit-any
type MethodBuildHtml = (location: Location) => any;

interface IMethods {
  _build_html: MethodBuildHtml;
}

interface IUpdateMethods {
  build_html?: MethodBuildHtml;
}

class Demo {
  location: Location;
  methods: IMethods;

  // deno-lint-ignore no-explicit-any
  html: any;
  display_id: string;

  constructor() {
    this.location = {
      latitude: 48.8866,
      longitude: 2.2249,
      timeZone: 'Europe/Paris',
    };

    this.methods = {
      _build_html: build_html,
    };

    this.build_html();

    const rnd = Math.floor(Math.random() * 1000);
    this.display_id = `Demo-${rnd}`;
  }

  [Symbol.for('Jupyter.display')]() {
    // const obj = { location: this.location };
    // return {
    //   'application/json': obj,
    // };

    const { location } = this;
    return {
      'text/html':
        `<b>latitude</b>: ${location.latitude}, <b>longitude</b>: ${location.longitude}, <b>timeZone</b>: ${location.timeZone}, `,
    };
  }

  build_html() {
    this.html = this.methods._build_html(this.location);
  }

  async show(date: string | Date | undefined, update = false) {
    const _date = typeof date === 'string'
      ? new Date(date)
      : date === undefined
      ? new Date()
      : date;
    const svg = this.html.update(_date);

    const opts = {
      data: { 'image/svg+xml': svg },
      metadata: {},
      transient: { display_id: this.display_id },
    };

    const msg_type = update ? 'update_display_data' : 'display_data';
    await Deno.jupyter.broadcast(msg_type, opts);
  }

  async animate(date_from: string | Date, date_to: string | Date, delay: number = 1e4) {
    await Deno.jupyter.broadcast('clear_output', { wait: false });

    const t0 = new Date().getTime();
    const date_rng = d3.utcDay.range(new Date(date_from), new Date(date_to));
    console.log(`nb dates: ${date_rng.length}, delay: ${delay} s`);

    for (const [i, e] of date_rng.entries()) {
      console.log(i, e);
      await this.show(e, true);
      await sleep(delay);
    }

    const t1 = new Date().getTime();
    const runtime = (t1 - t0) / 1000;
    const txt = `done: ${date_rng.length} dates in ${format_duration(runtime)} s`;
    await Deno.jupyter.broadcast('clear_output', { wait: false });
    return txt;
  }

  update_methods(methods: IUpdateMethods) {
    this.methods._build_html = methods?.build_html || this.methods._build_html;
  }
}

export default Demo;
