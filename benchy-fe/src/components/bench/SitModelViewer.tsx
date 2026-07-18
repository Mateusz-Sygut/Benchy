import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { GLView, ExpoWebGLRenderingContext } from 'expo-gl';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system/legacy';
import { decode as decodeBase64 } from 'base64-arraybuffer';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { colors } from '../../styles/colors';
import { useThemedStyles } from '../../hooks/useThemedStyles';

const SIT_CHARACTER_MODEL = require('../../../assets/models/sit-character.glb');
const ROTATION_PERIOD_SEC = 14;
const BRAND_GREEN = new THREE.Color(colors.primary[600]);
const GL_NOISE = /EXT_color_buffer_float|pixelStorei\(\)|EXGL:/i;

function silenceGlNoise(): () => void {
  const warn = console.warn;
  const log = console.log;
  const skip = (fn: typeof console.warn) => (...args: unknown[]) => {
    if (GL_NOISE.test(args.map(String).join(' '))) return;
    fn(...args);
  };
  console.warn = skip(warn);
  console.log = skip(log);
  return () => {
    console.warn = warn;
    console.log = log;
  };
}

type SitModelViewerProps = {
  size?: number;
};

function createRenderer(gl: ExpoWebGLRenderingContext): THREE.WebGLRenderer {
  const canvas = {
    width: gl.drawingBufferWidth,
    height: gl.drawingBufferHeight,
    style: {},
    addEventListener: () => {},
    removeEventListener: () => {},
    clientHeight: gl.drawingBufferHeight,
  };
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas as unknown as HTMLCanvasElement,
    context: gl as unknown as WebGLRenderingContext,
    antialias: true,
    alpha: true,
  });
  renderer.setPixelRatio(1);
  renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  return renderer;
}

function fitToView(root: THREE.Object3D, camera: THREE.PerspectiveCamera) {
  const box = new THREE.Box3().setFromObject(root);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  root.position.sub(center);

  const maxDim = Math.max(size.x, size.y, size.z) || 1;
  const fov = THREE.MathUtils.degToRad(camera.fov);
  const distance =
    Math.max(maxDim * 0.55 / Math.tan(fov / 2), (maxDim * 0.55 / Math.tan(fov / 2)) / camera.aspect) *
    1.15;

  camera.position.set(0, size.y * 0.05, distance);
  camera.near = distance / 100;
  camera.far = distance * 100;
  camera.lookAt(0, 0, 0);
  camera.updateProjectionMatrix();
}

async function loadModel(): Promise<THREE.Group> {
  const asset = Asset.fromModule(SIT_CHARACTER_MODEL);
  await asset.downloadAsync();
  const uri = asset.localUri ?? asset.uri;
  if (!uri) throw new Error('Sitting model URI missing');

  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  return new Promise((resolve, reject) => {
    new GLTFLoader().parse(decodeBase64(base64), '', (gltf) => resolve(gltf.scene), reject);
  });
}

function tintBrandGreen(root: THREE.Object3D) {
  root.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (!mesh.isMesh || !mesh.material) return;
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    for (const mat of mats) {
      if (mat && 'color' in mat) {
        (mat as THREE.MeshStandardMaterial).color.lerp(BRAND_GREEN, 0.55);
      }
    }
  });
}

export const SitModelViewer: React.FC<SitModelViewerProps> = ({ size = 160 }) => {
  const { theme } = useThemedStyles();
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const rafRef = useRef<number | null>(null);
  const disposedRef = useRef(false);
  const restoreConsoleRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    disposedRef.current = false;
    return () => {
      disposedRef.current = true;
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      restoreConsoleRef.current?.();
      restoreConsoleRef.current = null;
    };
  }, []);

  const onContextCreate = useCallback(async (gl: ExpoWebGLRenderingContext) => {
    restoreConsoleRef.current?.();
    restoreConsoleRef.current = silenceGlNoise();
    try {
      const renderer = createRenderer(gl);
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        40,
        gl.drawingBufferWidth / Math.max(gl.drawingBufferHeight, 1),
        0.1,
        100
      );
      scene.add(new THREE.AmbientLight(0xffffff, 1));
      const light = new THREE.DirectionalLight(0xffffff, 0.7);
      light.position.set(2, 3, 4);
      scene.add(light);

      const model = await loadModel();
      if (disposedRef.current) {
        renderer.dispose();
        return;
      }

      tintBrandGreen(model);
      fitToView(model, camera);
      scene.add(model);
      setLoading(false);

      const startedAt = performance.now();
      const spin = () => {
        if (disposedRef.current) return;
        model.rotation.y =
          ((performance.now() - startedAt) / 1000) * ((Math.PI * 2) / ROTATION_PERIOD_SEC);
        renderer.render(scene, camera);
        gl.endFrameEXP();
        rafRef.current = requestAnimationFrame(spin);
      };
      spin();
    } catch (error) {
      console.warn('Failed to load sitting model:', error);
      if (!disposedRef.current) {
        setFailed(true);
        setLoading(false);
      }
    }
  }, []);

  if (failed) return null;

  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      {loading && (
        <View style={styles.loader}>
          <ActivityIndicator color={theme.primary[500]} />
        </View>
      )}
      <GLView style={StyleSheet.absoluteFill} onContextCreate={onContextCreate} />
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    alignSelf: 'center',
    marginBottom: 4,
    overflow: 'hidden',
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
});