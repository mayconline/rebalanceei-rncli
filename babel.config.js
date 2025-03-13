module.exports = function (api) {
  api.cache(false);
  return {
    plugins: [
      '@babel/plugin-transform-named-capturing-groups-regex',
      'react-native-reanimated/plugin',
      [
        'module:react-native-dotenv',
        {
          envName: 'APP_ENV',
          moduleName: '@env',
          path: '.env',
          blocklist: null,
          allowlist: ['AMPLITUDE_KEY', 'SUGGESTIONS_API_URL', 'BACK_API_URL'],
          blacklist: null,
          whitelist: null,
          safe: true,
          allowUndefined: false,
          verbose: false,
        },
      ],
    ],
    presets: ['module:@react-native/babel-preset'],
  };
};
