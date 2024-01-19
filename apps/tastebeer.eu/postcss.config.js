const { join } = require('path');
const { getTailwindConfig } = require('../../libs/ui-kit/tailwind.config');

module.exports = {
  plugins: {
    tailwindcss: {
      config: getTailwindConfig(join(__dirname, 'app/**/*!(*.stories|*.spec).tsx')),
    },
    autoprefixer: {},
  },
}
