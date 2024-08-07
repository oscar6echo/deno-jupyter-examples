import { IDatum, IPlotOptions, load_data, plot } from './elements.ts';

type MethodLoadData = () => Promise<IDatum[]>;
type MethodPlot = (
  data: IDatum[],
  options: IPlotOptions,
) => string;

interface IMethods {
  _load_data: MethodLoadData;
  _plot: MethodPlot;
}

interface IUpdateMethods {
  load_data?: MethodLoadData;
  plot?: MethodPlot;
}

class Demo {
  data: IDatum[];
  methods: IMethods;

  constructor() {
    this.data = [];

    this.methods = {
      _load_data: load_data,
      _plot: plot,
    };
  }

  async load_data() {
    this.data = await this.methods._load_data();
  }

  async plot(options: IPlotOptions) {
    const svg = this.methods._plot(this.data, options);

    const opts = {
      data: { 'text/html': svg },
      // data: { 'image/svg+xml': svg },
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
