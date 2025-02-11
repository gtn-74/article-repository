import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx|mdx)"],
  addons: [
    '@storybook/addon-actions',
    "@storybook/addon-onboarding",
    "@storybook/addon-docs",
    "@storybook/addon-interactions",
    "@storybook/addon-outline/manager",
    '@storybook/addon-interactions',
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
};

export default config;
