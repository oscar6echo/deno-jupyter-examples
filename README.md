# Deno Jupyter Examples

This is a short collections of deno-kernel Juptyer notebooks drawing on:

+ polars version for node: [nodejs-polars](https://github.com/pola-rs/nodejs-polars)
+ sample ObservableHQ notebooks
+ a custom "reload" feature mimicking IPyhton [autoreload magic](https://ipython.org/ipython-doc/3/config/extensions/autoreload.html)

## Run

Prerequisite: `jupyter`, `deno` installed.

```sh
# install deno kernel
deno jupyter --install

# launch jupyter
deno task jupyter
```
