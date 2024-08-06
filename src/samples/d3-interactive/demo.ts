import d3 from '../../common/d3.ts';
import { create_html_document } from '../../common/util.ts';

class Demo {
  width: number;
  height: number;
  x: number;
  y: number;
  r: number;
  color: string;

  // deno-lint-ignore no-explicit-any
  svg: any;

  display_id: string;

  constructor(width = 300, height = 50, r = 10, color = 'blue') {
    this.width = width;
    this.height = height;
    this.x = width / 2;
    this.y = height / 2;
    this.r = r;
    this.color = color;

    this.svg = this.build_svg(this.r, this.color);

    const rnd = Math.floor(Math.random() * 1000);
    this.display_id = `Demo-${rnd}`;
  }

  async show(update = false) {
    const opts = {
      data: { 'image/svg+xml': this.svg },
      metadata: {},
      transient: { display_id: this.display_id },
    };
    const msg_type = update ? 'update_display_data' : 'display_data';
    return await Deno.jupyter.broadcast(msg_type, opts);
  }

  // // CLOSER TO NATIVE OUTPUT BUT DIFFERENT
  // [Symbol.for('Jupyter.display')]() {
  //   const obj = { r: this.r, color: this.color };
  //   return {
  //     'application/json': obj,
  //   };
  // }

  // // RENDERS BUT ALSO ERROR
  // [Symbol.for('Jupyter.display')]() {
  //   return this.show();
  // }

  build_svg(r: number, color: string) {
    const document = create_html_document();
    const rootSvg = d3.creator('svg').call(document.documentElement);

    const svg = d3.select(rootSvg)
      .attr('width', this.width)
      .attr('height', this.height);

    svg.append('circle')
      .attr('cx', this.x)
      .attr('cy', this.y)
      .attr('r', r)
      .attr('stroke', 'aliceblue')
      .attr('stroke-width', '1')
      .attr('fill', color);

    return rootSvg.outerHTML;
  }

  update(r: number, color: string) {
    this.r = r;
    this.color = color;

    this.svg = this.build_svg(this.r, this.color);
    this.show(true);
  }
}

export default Demo;
