import type { StorybookConfig } from '@storybook/angular';

const config: StorybookConfig = {
  stories: [
    "../libs/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  addons: [
    "@storybook/addon-docs"
  ],
  framework: {
    name: "@storybook/angular",
    options: {}
  }
};

export default config;