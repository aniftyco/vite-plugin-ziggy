import { readFileSync } from 'fs';
import { resolve } from 'path';

export const ZIGGY_PACKAGE_NAME = 'tightenco/ziggy';

export const getComposerPackageVersion = (): string => {
  try {
    const composerPath = resolve(process.cwd(), 'composer.json');
    const composer = JSON.parse(readFileSync(composerPath, 'utf-8'));

    if (!composer.require?.[ZIGGY_PACKAGE_NAME]) {
      throw new Error(`${ZIGGY_PACKAGE_NAME} not found in composer.json dependencies`);
    }

    const version = composer.require[ZIGGY_PACKAGE_NAME];
    const match = version.match(/^[~^><]?(\d+)/);

    if (!match) {
      throw new Error(`Invalid version format for ${ZIGGY_PACKAGE_NAME}: ${version}`);
    }

    return match[1];
  } catch (error) {
    if (error instanceof Error && (error as NodeJS.ErrnoException).code === 'ENOENT') {
      throw new Error('composer.json not found in project root');
    }

    throw error;
  }
};
