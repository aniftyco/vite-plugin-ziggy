# Ziggy Vite Plugin

> Vite plugin for generating Ziggy route types automatically when your route files change

```sh
npm i -D vite-plugin-ziggy
```

## Usage

After you installed `vite-plugin-ziggy` add it to your Vite configuration like so:

```ts
import { defineConfig } from 'vite';
...
import ziggy from 'vite-plugin-ziggy';

export default defineConfig({
    plugins: [
        ...
        ziggy(),
    ],
});
```

Then just add the types to `tsconfig.json`:

```json
{
    "compilerOptions": {
        ...,
        "types": [
            "vite/client",
            "vite-plugin-ziggy/routes"
        ]
    }
}
```

After that, every time you make a change to any routes in `routes/` This plugin will auto generate your route types for
Ziggy's `route()` to auto complete for you.
