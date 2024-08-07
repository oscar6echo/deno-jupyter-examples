import pl from 'nodejs-polars';
import { load_data, plot } from './elements.ts';

type MethodLoadData = (source: string) => Promise<pl.DataFrame>;
type MethodPlot = (df: pl.DataFrame) => string;

interface IMethods {
  _load_data: MethodLoadData;
  _plot: MethodPlot;
}

interface IUpdateMethods {
  load_data?: MethodLoadData;
  plot?: MethodPlot;
}

class Demo {
  df: pl.DataFrame;
  methods: IMethods;

  constructor() {
    this.df = pl.DataFrame();

    this.methods = {
      _load_data: load_data,
      _plot: plot,
    };
  }

  async load_data(source: string) {
    this.df = await this.methods._load_data(source);
  }

  async plot() {
    const html = this.methods._plot(this.df);

    const opts = {
      data: { 'text/html': html },
      metadata: {},
    };

    await Deno.jupyter.broadcast('display_data', opts);
  }

  update_methods(methods: IUpdateMethods) {
    this.methods._load_data = methods?.load_data || this.methods._load_data;
    this.methods._plot = methods?.plot || this.methods._plot;
  }
}

export default Demo;
