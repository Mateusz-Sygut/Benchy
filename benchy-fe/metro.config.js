const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

const assetExts = new Set(config.resolver.assetExts);
assetExts.add('glb');
assetExts.add('gltf');
config.resolver.assetExts = Array.from(assetExts);

// Keep 3D models out of the JS transformer pipeline.
config.resolver.sourceExts = config.resolver.sourceExts.filter(
  (ext) => ext !== 'glb' && ext !== 'gltf'
);

module.exports = config;
