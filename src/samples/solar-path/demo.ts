import { display } from 'display';
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

  constructor() {
    this.location = {
      latitude: 48.8866,
      longitude: 2.2249,
      timeZone: 'Europe/Paris',
    };

    this.methods = {
      _build_html: build_html,
    };
  }

  build_html() {
    this.html = this.methods._build_html(this.location);
  }

  async update(date: Date) {
    if (!this.html) return;
    return await display(this.html.update(date));
  }

  update_methods(methods: IUpdateMethods) {
    this.methods._build_html = methods?.build_html || this.methods._build_html;
  }
}

export default Demo;
