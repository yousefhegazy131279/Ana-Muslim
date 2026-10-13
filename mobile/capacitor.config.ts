import type { CapacitorConfig } from '@capacitor/cli';
const config: CapacitorConfig = {
  appId: 'com.hgz.anamuslim',
  appName: 'أنا مسلم',
  webDir: 'dist',
  backgroundColor: '#f7faf5',
  plugins: { LocalNotifications: { smallIcon: 'ic_stat_book', iconColor: '#046a38' } },
};
export default config;
