import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.acadevia.app',
  appName: 'Acadevia',
  webDir: 'dist',
  server: {
    androidScheme: 'http'
  }
};

export default config;