import { Plugin } from 'vite';
import { run } from 'vite-plugin-run';

export type Config = {};

export default (config?: Config): Plugin => {
  const { configResolved, handleHotUpdate } = run([
    {
      name: 'ziggy-generator',
      run: ['php', 'artisan', 'ziggy:generate', 'node_modules/vite-plugin-ziggy/routes', '--types-only'],
      condition: (file) => file.includes('/routes/') && file.endsWith('.php'),
    },
  ]);

  return {
    name: 'ziggy-plugin',
    configResolved,
    handleHotUpdate,
  };
};
