import React, { useMemo } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import {
  Canvas,
  Rect,
  vec,
  LinearGradient,
  Fill,
  Group,
  Skia,
  Shader,
  useClock,
} from "@shopify/react-native-skia";
import { useDerivedValue } from "react-native-reanimated";

const { width: W, height: H } = Dimensions.get("window");

const shaderCode = `
uniform float2 iResolution;
uniform float iTime;
uniform float2 uCenter;
uniform float uRadius;
uniform float3 iColorDeep;
uniform float3 iColorBright;
uniform float iAlpha;

float hash21(float2 p) {
  p = fract(p*float2(123.34, 345.45));
  p += dot(p, p+34.345);
  return fract(p.x*p.y);
}

float noise(float2 p) {
  float2 i = floor(p);
  float2 f = fract(p);
  float a = hash21(i);
  float b = hash21(i + float2(1.0, 0.0));
  float c = hash21(i + float2(0.0, 1.0));
  float d = hash21(i + float2(1.0, 1.0));
  float2 u = f*f*(3.0-2.0*f);
  return mix(a, b, u.x) + (c - a)*u.y*(1.0 - u.x) + (d - b)*u.x*u.y;
}

float fbm(float2 p) {
  float v = 0.0;
  float a = 0.5;
  float2 shift = float2(100.0, 100.0);
  for (int i = 0; i < 6; i++) {
    v += a * noise(p);
    p = p*2.0 + shift;
    a *= 0.5;
  }
  return v;
}

// Smooth rotation
float2 rot2d(float2 p, float a) {
  float c = cos(a);
  float s = sin(a);
  return float2(p.x*c - p.y*s, p.x*s + p.y*c);
}

half4 main(float2 fragCoord) {
  float t = iTime;

  // Seamless loop (60 sec cycle)
  const float CYCLE = 60.0;
  const float PI2 = 6.28318530718;
  float phase = (t / CYCLE) * PI2;

  float2 p = (fragCoord - 0.5*iResolution) / iResolution.y;
  float2 c = (uCenter - 0.5*iResolution) / iResolution.y;

  // Fabric position with gentle rotation
  float2 fp = p - c;
  fp = rot2d(fp, sin(phase * 0.5) * 0.2);

  float rBase = uRadius / iResolution.y;

  // --- Heavy domain warping for organic flowing shape ---
  float2 warpCoord = fp * 1.5;
  float wx = sin(phase * 0.3) * 0.5;
  float wy = cos(phase * 0.35) * 0.5;

  // Multiple layers of warping for more organic feel
  float w1 = fbm(warpCoord + float2(wx, wy));
  float w2 = fbm(warpCoord * 1.3 + float2(w1 * 0.5, -wy) + 30.0);
  float w3 = fbm(warpCoord * 0.8 - float2(wy, w2 * 0.3) + 60.0);

  // Strong warp displacement
  float2 warped = fp + float2(w1 - 0.5, w2 - 0.5) * 0.7 + float2(w3 - 0.5) * 0.3;

  // --- Create fabric shape with flowing tendrils ---
  float dist = length(warped * float2(1.0, 1.3)); // slightly elongated

  float angle = atan(warped.y, warped.x);

  // More dramatic extensions for fabric arms/tendrils
  float tendrils =
    0.25 * sin(angle * 2.0 + phase * 0.6 + w1 * 3.0) +
    0.18 * sin(angle * 3.0 - phase * 0.4 + w2 * 2.0) +
    0.12 * sin(angle * 4.0 + phase * 0.3) +
    0.08 * sin(angle * 6.0 - phase * 0.5 + 1.5);

  // Edge noise for irregular fabric boundary
  float edgeN = fbm(warped * 4.0 + float2(sin(phase * 0.2) * 0.6, cos(phase * 0.25) * 0.6));
  float edgeIrreg = (edgeN - 0.5) * 0.35;

  // Final fabric edge - very organic
  float fabricEdge = rBase * (0.6 + tendrils + edgeIrreg);

  // Very soft, feathered edge
  float softness = 0.15 * rBase;
  float mask = smoothstep(fabricEdge, fabricEdge - softness, dist);

  // Secondary mask layer for thin areas
  float thinMask = smoothstep(fabricEdge * 0.7, fabricEdge * 0.5, dist);

  if (mask <= 0.001) {
    return half4(0.0, 0.0, 0.0, 0.0);
  }

  // --- Visible fold lines / creases ---
  float2 foldUV = warped * 5.0 + float2(sin(phase * 0.2) * 0.4, cos(phase * 0.25) * 0.4);

  // Primary folds - larger
  float foldPattern = fbm(foldUV);
  float folds = smoothstep(0.35, 0.65, foldPattern);

  // Sharp crease lines
  float creaseUV = fbm(foldUV * 2.5 + 20.0);
  float creaseLines = smoothstep(0.48, 0.52, creaseUV);

  // Flow lines along fabric
  float flowAngle = atan(warped.y, warped.x);
  float flowLines = sin(flowAngle * 8.0 + foldPattern * 6.0 + phase * 0.5) * 0.5 + 0.5;
  flowLines = smoothstep(0.3, 0.7, flowLines);

  // --- Silk highlights ---
  float2 sheenUV = warped * 3.5 + float2(cos(phase * 0.3) * 0.5, sin(phase * 0.35) * 0.5);

  float sheen = sin((sheenUV.x * 5.0 + sheenUV.y * 3.0) + phase * 0.8) * 0.5 + 0.5;
  sheen = pow(smoothstep(0.4, 0.9, sheen), 1.5); // sharper highlights

  float sheenNoise = fbm(sheenUV * 3.0);
  float microSheen = smoothstep(0.4, 0.8, sheenNoise);

  float highlight = sheen * 0.7 + microSheen * 0.3;

  // --- Color with fold depth ---
  float depth = folds * 0.5 + flowLines * 0.3 + creaseLines * 0.2;

  float3 col = mix(iColorDeep, iColorBright, highlight * 0.6 + depth * 0.4);

  // Darken in crease lines
  col *= (0.7 + creaseLines * 0.3);

  // Brighten highlights more
  col += iColorBright * sheen * 0.2;

  // --- Layered transparency like real silk ---
  // Base: very transparent
  float alpha = 0.15;

  // Add opacity in folded/bunched areas
  alpha += folds * 0.35;

  // Flow lines add subtle opacity variation
  alpha += flowLines * 0.1;

  // Center is slightly more opaque
  float centerOpacity = smoothstep(fabricEdge, 0.0, dist);
  alpha += centerOpacity * 0.2;

  // Thin stretched areas are more transparent
  float thinArea = 1.0 - thinMask;
  alpha *= (0.5 + thinMask * 0.5);

  // Edge fade
  alpha *= mask;

  // Add slight opacity for highlights (silk catching light)
  alpha += sheen * 0.1 * mask;

  // Global alpha
  alpha *= iAlpha;

  // Keep it translucent
  alpha = clamp(alpha, 0.0, 0.75);

  return half4(col.r, col.g, col.b, alpha);
}
`;

interface FloatingFabricBackgroundProps {
  variant?: "safe" | "medium" | "hazardous";
}

// Color presets (subtle, original)
const colorPresets = {
  safe: {
    deep: [0.005, 0.06, 0.04],
    bright: [0.02, 0.12, 0.08],
    alpha: 0.1,
  },
  medium: {
    deep: [0.07, 0.03, 0.005],
    bright: [0.14, 0.06, 0.015],
    alpha: 0.08,
  },
  hazardous: {
    deep: [0.06, 0.005, 0.01],
    bright: [0.12, 0.02, 0.025],
    alpha: 0.06,
  },
};

export function FloatingFabricBackground({ variant = "safe" }: FloatingFabricBackgroundProps) {
  const clock = useClock();
  const colors = colorPresets[variant];

  const shaderSource = useMemo(() => {
    try {
      return Skia.RuntimeEffect.Make(shaderCode);
    } catch (e) {
      console.warn("Shader compilation failed:", e);
      return null;
    }
  }, []);

  const uniforms = useDerivedValue(() => {
    const t = clock.value / 1000;

    // Seamless loop cycle (60 seconds, matches shader)
    const CYCLE = 60.0;
    const phase = ((t % CYCLE) / CYCLE) * Math.PI * 2;

    // Looping drift movement (no jumps) - centered
    const driftX =
      W * 0.5 +
      Math.sin(phase) * W * 0.03 +
      Math.sin(phase * 0.5) * W * 0.02;

    const driftY =
      H * 0.5 +
      Math.sin(phase * 0.5) * H * 0.03 +
      Math.cos(phase * 0.3) * H * 0.02;

    // Scale factor for entire scene (2.5x for almost full screen on portrait)
    const SCALE = 2.5;

    return {
      iResolution: [W / SCALE, H / SCALE],
      iTime: t,
      uCenter: [driftX / SCALE, driftY / SCALE],
      uRadius: Math.min(W, H) * 0.7 / SCALE,
      iColorDeep: colors.deep,
      iColorBright: colors.bright,
      iAlpha: colors.alpha,
    };
  }, [clock, colors]);

  if (!shaderSource) {
    return null;
  }

  return (
    <View style={styles.root} pointerEvents="none">
      <Canvas style={StyleSheet.absoluteFill}>
        {/* Fabric layer */}
        <Group opacity={0.6}>
          <Fill>
            <Shader source={shaderSource} uniforms={uniforms} />
          </Fill>
        </Group>

        {/* Subtle spotlight */}
        <Rect x={0} y={0} width={W} height={H}>
          <LinearGradient
            start={vec(W * 0.2, H * 0.15)}
            end={vec(W * 0.8, H * 0.95)}
            colors={["rgba(255,255,255,0.02)", "rgba(255,255,255,0.0)"]}
          />
        </Rect>
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
