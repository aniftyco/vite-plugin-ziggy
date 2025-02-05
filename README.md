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
    ziggy({
      sail: true, // Uses Sail instead of PHP
      group: 'api',
      url: 'http://laravel-app.test',
      only: ['admin.*'],
      except: ['debugbar.*'],
    }),
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

### Configuration

This plugin allows you to set the following configuration:

| Key         | Description                                     | Required | Default                                 |
| ----------- | ----------------------------------------------- | -------- | --------------------------------------- |
| `path`      | The path to output the types file               | ❌ No    | `node_modules/vite-plugin-ziggy/routes` |
| `only`      | Include _ONLY_ these routes                     | ❌ No    | `[]`                                    |
| `except`    | All routes _EXCEPT_ these                       | ❌ No    | `[]`                                    |
| `sail`      | Use `sail` instead of the `php` command         | ❌ No    | `false`                                 |
| `group`     | Route group to generate                         | ❌ No    | `undefined` (not set by default)        |
| `url`       | The application URL                             | ❌ No    | `undefined` (not set by default)        |
| `types`     | Generate TypeScript declaration file            | ❌ No    | `true`                                  |
| `typesOnly` | Generate _only_ the TypeScript declaration file | ❌ No    | `true`                                  |
