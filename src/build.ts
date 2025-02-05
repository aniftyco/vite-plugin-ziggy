import { Config } from './config.js';

export type BuildConfig = Required<Omit<Config, 'url' | 'group'>> & {
  url?: string;
  group?: string;
};

export const build = (version: string, config: BuildConfig): string[] => {
  const cmd = [config.sail && !process.env.LARAVEL_SAIL ? 'sail' : 'php', 'artisan', 'ziggy:generate', config.path];

  if (config.group) cmd.push('--group', config.group);
  if (config.url) cmd.push('--url', config.url);

  if (['1', '2'].includes(version)) {
    if (config.types) cmd.push('--types');
    if (config.typesOnly) cmd.push('--types-only');

    if (version === '2') {
      if (config.only.length > 0) cmd.push('--only', config.only.join(','));
      if (config.except.length > 0) cmd.push('--except', config.except.join(','));
    }
  }

  return cmd;
};
