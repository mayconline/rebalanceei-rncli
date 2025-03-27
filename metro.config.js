const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { resolver: defaultResolver } = getDefaultConfig(__dirname);

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */

const config = {
  resolver: {
    ...defaultResolver,
    sourceExts: [...defaultResolver.sourceExts, 'cjs'],
  },
  resetCache: true,
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
