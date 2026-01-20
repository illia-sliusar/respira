import React, { useMemo } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import {
  Canvas,
  Fill,
  Skia,
  Shader,
  useClock,
} from "@shopify/react-native-skia";
import { useDerivedValue } from "react-native-reanimated";

const { width: W, height: H } = Dimensions.get("window");

/**
 * Runtime shader (SkSL) — "fabric floating in water" effect
 */
const shaderCode = `
uniform float2 iResolution;
uniform float iTime;
uniform float3 iColor;
uniform float3 iColorBright;
uniform float iAlphaMultiplier;

float hash21(float2 p) {
  p = fract(p * float2(123.34, 345.45));
  p += dot(p, p + 34.345);
  return fract(p.x * p.y);
}

float noise(float2 p) {
  float2 i = floor(p);
  float2 f = fract(p);
  float a = hash21(i);
  float b = hash21(i + float2(1.0, 0.0));
  float c = hash21(i + float2(0.0, 1.0));
  float d = hash21(i + float2(1.0, 1.0));
  float2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

float fbm(float2 p) {
  float v = 0.0;
  float a = 0.55;
  float2 shift = float2(100.0, 100.0);
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = p * 2.02 + shift;
    a *= 0.5;
  }
  return v;
}

half4 main(float2 fragCoord) {
  float2 uv = fragCoord / iResolution;
  float2 p = (uv - 0.5) * float2(iResolution.x / iResolution.y, 1.0);

  float t = iTime;

  // drift + gentle swirl (fabric in water) - slow
  float drift = t * 0.008;
  float swirl = sin(t * 0.025) * 0.1;

  // domain warp
  float2 q = p;
  q.y += drift;
  q.x += swirl;

  float n1 = fbm(q * 2.0 + float2(0.0, t * 0.02));
  float n2 = fbm(q * 3.5 - float2(t * 0.012, t * 0.008));
  float warp = (n1 - 0.5) * 0.5 + (n2 - 0.5) * 0.3;

  float2 r = q + float2(warp, -warp) * 0.7;

  // fabric folds
  float folds = fbm(r * 4.0 + float2(0.0, t * 0.015));
  folds = smoothstep(0.2, 0.8, folds);

  // sheen bands (silk-like highlights)
  float band = sin((r.x * 5.0 + r.y * 2.0) + t * 0.18) * 0.5 + 0.5;
  band = smoothstep(0.3, 0.85, band);

  // micro texture
  float micro = fbm(r * 15.0 + float2(t * 0.04, -t * 0.025));
  micro = smoothstep(0.25, 0.75, micro);

  // cloth shape mask
  float blob = fbm(q * 1.0 + float2(0.0, t * 0.005));
  float shape = smoothstep(0.1, 0.6, blob);

  // color mixing
  float highlight = band * 0.6 + micro * 0.25;
  float depth = folds * 0.65 + warp * 0.2;

  float3 col = mix(iColor, iColorBright, highlight);
  col *= (0.5 + depth * 0.6);

  // alpha: translucent with variations
  float alpha = 0.03 + shape * (0.35 + folds * 0.15);
  alpha *= (0.8 + band * 0.3);
  alpha *= iAlphaMultiplier;

  // vignette
  float2 v = uv - 0.5;
  float vig = smoothstep(0.9, 0.15, dot(v, v) * 1.2);
  alpha *= vig;
  col *= (0.5 + 0.5 * vig);

  return half4(col.r, col.g, col.b, alpha);
}
`;

interface FabricBackgroundProps {
  variant?: "safe" | "medium" | "hazardous";
}

// Color presets for each variant (very subtle)
const colorPresets = {
  safe: {
    base: [0.005, 0.06, 0.04],       // very subtle green
    bright: [0.02, 0.12, 0.08],      // soft green
    alpha: 0.1,
  },
  medium: {
    base: [0.07, 0.03, 0.005],       // very subtle orange
    bright: [0.14, 0.06, 0.015],     // soft orange
    alpha: 0.08,
  },
  hazardous: {
    base: [0.06, 0.005, 0.01],       // very subtle red
    bright: [0.12, 0.02, 0.025],     // soft red
    alpha: 0.06,
  },
};

export function FabricBackground({ variant = "safe" }: FabricBackgroundProps) {
  const clock = useClock();
  const colors = colorPresets[variant];

  // Lazy init shader
  const shaderSource = useMemo(() => {
    try {
      return Skia.RuntimeEffect.Make(shaderCode);
    } catch (e) {
      console.warn("Shader compilation failed:", e);
      return null;
    }
  }, []);

  const uniforms = useDerivedValue(() => {
    return {
      iResolution: [W, H],
      iTime: clock.value / 1000,
      iColor: colors.base,
      iColorBright: colors.bright,
      iAlphaMultiplier: colors.alpha,
    };
  }, [clock, colors]);

  if (!shaderSource) {
    return null;
  }

  return (
    <View style={styles.root} pointerEvents="none">
      <Canvas style={StyleSheet.absoluteFill}>
        <Fill>
          <Shader source={shaderSource} uniforms={uniforms} />
        </Fill>
      </Canvas>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
  },
});
