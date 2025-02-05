import { readFileSync } from 'fs';
import { resolve } from 'path';
import { Plugin } from 'vite';
import { run } from 'vite-plugin-run';

/**
 * Options for configuring the Ziggy plugin.
 */
export type Config = {
  /**
   * Path to the generated JavaScript/TypeScript file.
   * @default 'node_modules/vite-plugin-ziggy/routes'
   */
  path?: string;

  /**
   * Whether to use `sail` instead of the `php` command.
   * @default false
   */
  sail?: boolean;

  /**
   * Route group to generate.
   */
  group?: string;

  /**
   * Application URL.
   */
  url?: string;

  /**
   * Generate TypeScript declaration file.
   * @default true
   */
  types?: boolean;

  /**
   * Generate only the TypeScript declaration file.
   * @default true
   */
  typesOnly?: boolean;

  /**
   * Route name patterns to include.
   * @default []
   */
  only?: string[];

  /**
   * Route name patterns to exclude.
   * @default []
   */
  except?: string[];
};

const ZIGGY_PACKAGE_NAME = 'tightenco/ziggy';
const SUPPORTED_VERSIONS = ['1', '2'];

function getComposerPackageVersion(): string {
  try {
    const composerPath = resolve(process.cwd(), 'composer.json');
    const composer = JSON.parse(readFileSync(composerPath, 'utf-8'));

    if (!composer.require?.[ZIGGY_PACKAGE_NAME]) {
      throw new Error(
        `${ZIGGY_PACKAGE_NAME} not found in composer.json dependencies`,
      );
    }

    const version = composer.require[ZIGGY_PACKAGE_NAME];
    const match = version.match(/^[~^><]?(\d+)/);

    if (!match) {
      throw new Error(
        `Invalid version format for ${ZIGGY_PACKAGE_NAME}: ${version}`,
      );
    }

    const majorVersion = match[1];
    if (!SUPPORTED_VERSIONS.includes(majorVersion)) {
      throw new Error(
        `Unsupported Ziggy version: ${majorVersion}. Supported versions: ${SUPPORTED_VERSIONS.join(', ')}`,
      );
    }

    return majorVersion;
  } catch (error) {
    if (
      error instanceof Error &&
      (error as NodeJS.ErrnoException).code === 'ENOENT'
    ) {
      throw new Error('composer.json not found in project root');
    }
    throw error;
  }
}

function buildCommand(
  version: string,
  config: Required<Omit<Config, 'url' | 'group'>> & {
    url?: string;
    group?: string;
  },
): string[] {
  const cmd = [
    config.sail ? 'sail' : 'php',
    'artisan',
    'ziggy:generate',
    config.path,
  ];

  if (config.group) cmd.push('--group', config.group);
  if (config.url) cmd.push('--url', config.url);

  if (SUPPORTED_VERSIONS.includes(version)) {
    if (config.types) cmd.push('--types');
    if (config.typesOnly) cmd.push('--types-only');

    if (version === '2') {
      if (config.only.length > 0)
        cmd.push('--only', config.only.join(','));
      if (config.except.length > 0)
        cmd.push('--except', config.except.join(','));
    }
  }

  return cmd;
}

export default (config: Config = {}): Plugin => {
  const defaultConfig = {
    path: 'node_modules/vite-plugin-ziggy/routess',
    sail: false,
    types: true,
    typesOnly: true,
    only: [],
    except: [],
  };

  try {
    const version = getComposerPackageVersion();
    const cmd = buildCommand(version, { ...defaultConfig, ...config });

    const { configResolved, handleHotUpdate } = run([
      {
        name: 'ziggy-generator',
        run: cmd,
        condition: (file) =>
          file.includes('/routes/') && file.endsWith('.php'),
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
