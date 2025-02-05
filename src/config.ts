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

export const defaultConfig: Config = {
  path: 'node_modules/vite-plugin-ziggy/routes',
  sail: false,
  types: true,
  typesOnly: true,
  only: [],
  except: [],
};
