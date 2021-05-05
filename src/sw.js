import * as googleAnalytics from 'workbox-google-analytics';
import { getFiles, setupPrecaching, setupRouting } from 'preact-cli/sw/';

setupRouting();
setupPrecaching(getFiles());

googleAnalytics.initialize();
