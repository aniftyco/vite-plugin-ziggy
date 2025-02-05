import { Plugin } from 'vite';
import { run } from 'vite-plugin-run';
import { defaultConfig, Config } from './config.js';
import { getComposerPackageVersion } from './utils.js';
import { build, BuildConfig } from './build.js';

export default (config: Config = {}): Plugin => {
  try {
    const version = getComposerPackageVersion();
    const cmd = build(version, { ...defaultConfig, ...config } as BuildConfig);

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
  } catch (error) {
    console.error('\n[vite-plugin-ziggy] Error:');
    if (error instanceof Error) {
      console.error(error.message);
      if (process.env.NODE_ENV === 'development') {
        console.error(error.stack);
      }
    } else {
      throw error;
    }
  }

  return {} as Plugin;
};
