module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
      // ❌ Removed react-native-dotenv because .env was deleted
    ],
  };
};
