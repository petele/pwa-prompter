import path from 'path';
import { DefinePlugin } from 'webpack';
import CopyWebpackPlugin from 'copy-webpack-plugin';

const stringReplacementPlugin = new DefinePlugin({
  __BUILD_TYPE__: JSON.stringify(process.env.NODE_ENV),
  __BUILD_DATE__: JSON.stringify(new Date()),
});

export default (config) => {
  console.log('** BUILD_TYPE:', process.env.NODE_ENV);
  if (process.env.NODE_ENV === 'production') {
    console.log(` * 'sourcemaps' will not be built.`);
    console.log(` * 'console' will be disabled.`);
    config.devtool = false;
  }
  config.plugins.push(stringReplacementPlugin);

  // Copy static files.
  const copyStaticFiles = new CopyWebpackPlugin({
    patterns: [{
      from: '*',
      context: path.resolve(__dirname, 'src/static'),
    }],
  });
  config.plugins.push(copyStaticFiles);
}
