import { Plugin } from 'vite';
import { run } from 'vite-plugin-run';

export type Config = {
  path?: string;
  only?: string[];
  except?: string[];
};

export default ({ path = 'node_modules/vite-plugin-ziggy/routes', only = [], except = [] }: Config = {}): Plugin => {
  const cmd = ['php', 'artisan', 'ziggy:generate', path, '--types-only'];

  if (only.length) {
    cmd.push('--only', only.join(','));
  }

  if (except.length) {
    cmd.push('--except', except.join(','));
  }

  const { configResolved, handleHotUpdate } = run([
    {
      name: 'ziggy-generator',
      run: cmd,
      condition: (file) => file.includes('/routes/') && file.endsWith('.php'),
    },
  ]);

  return {
    name: 'ziggy-plugin',
    configResolved,
    handleHotUpdate,
  };
};
