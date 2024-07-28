import * as path from '@std/path';

const buildReload = () => {
    let i = 0;

    const reload = async (pathRelative: string) => {
        const cwd = Deno.cwd();
        const pathAbsolute = path.resolve(cwd, pathRelative);
        const module = await import(`${pathAbsolute}#${i++}`);
        return module;
    };

    return reload;
};

export { buildReload };
