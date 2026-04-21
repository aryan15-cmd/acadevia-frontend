import { registerPlugin } from '@capacitor/core';

export interface AppBlockerPlugin {
  setBlockedApps(options: { apps: string[] }): Promise<void>;
}

const AppBlocker = registerPlugin<AppBlockerPlugin>('AppBlocker');

export default AppBlocker;