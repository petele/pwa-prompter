import { DefinePlugin } from 'webpack';

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
}
