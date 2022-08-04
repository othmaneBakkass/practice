const postcssPresetEnv = require('postcss-preset-env');
const cssNano = require('cssnano');

module.exports = {
  plugins: [
    require('postcss-import'),
    require('tailwindcss'),
    require('autoprefixer'),
    process.env.NODE_ENV === 'production' ? cssNano : undefined,
    postcssPresetEnv,
  ],
};
