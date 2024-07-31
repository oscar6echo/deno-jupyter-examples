import { Displayable } from 'display-format';
import { IDatum, IPlotOptions, load_data, plot } from './elements.ts';

type MethodLoadData = () => Promise<IDatum[]>;
type MethodPlot = (
  data: IDatum[],
  options: IPlotOptions,
) => Promise<void | Displayable | undefined>;

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

  plot(options: IPlotOptions) {
    return this.methods._plot(this.data, options);
  }

  update_methods(methods: IUpdateMethods) {
    this.methods._load_data = methods?.load_data || this.methods._load_data;
    this.methods._plot = methods?.plot || this.methods._plot;
  }
}

export default Demo;
