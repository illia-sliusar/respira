import React from "react";
import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { useAnimatedStyle, interpolate } from "react-native-reanimated";
import Svg, { Defs, LinearGradient as SvgLinearGradient, Stop, Path } from "react-native-svg";

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

// "medium" for score 6-7, "hazardous" for score 1-5, "safe" for 8+
type BackgroundVariant = "safe" | "medium" | "hazardous";

interface BackgroundColors {
  topGradient: [string, string];
  blobGradient: [string, string];
}

interface AnimatedBackgroundProps {
  pulseProgress: Animated.SharedValue<number>;
  colors: BackgroundColors;
  variant?: BackgroundVariant;
}

export function AnimatedBackground({ pulseProgress, colors, variant = "safe" }: AnimatedBackgroundProps) {
  const pulseAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(pulseProgress.value, [0, 1], [1, 1.05]),
        },
      ],
    };
  });

  // Extract color from rgba for SVG gradient
  const extractColorFromRgba = (rgba: string): string => {
    const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (match) {
      const [, r, g, b] = match;
      return `rgb(${r}, ${g}, ${b})`;
    }
    return rgba;
  };

  const blobColor = extractColorFromRgba(colors.blobGradient[0]);

  // Blob config based on variant
  const isHazardous = variant === "hazardous";
  const blobSize = isHazardous ? 500 : 600;
  const halfSize = blobSize / 2;
  const marginTopOffset = isHazardous ? -halfSize : -360; // centered vs shifted up 60%
  const blobOpacity = isHazardous ? 0.2 : 0.4;
  const stopOpacity = isHazardous ? 1 : 0.8;
  const svgTransform = isHazardous
    ? "translate(100 100) scale(1.1)"
    : "translate(100 100) scale(1.15) rotate(15)";

  return (
    <View className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Top gradient */}
      <LinearGradient
        colors={colors.topGradient}
        style={{
          position: "absolute",
          top: -80,
          left: 0,
          right: 0,
          height: "60%",
        }}
        pointerEvents="none"
      />

      {/* SVG blob */}
      <Animated.View
        style={[
          {
            position: "absolute",
            top: "50%",
            left: "50%",
            width: blobSize,
            height: blobSize,
            marginLeft: -halfSize,
            marginTop: marginTopOffset,
            opacity: blobOpacity,
          },
          pulseAnimatedStyle,
        ]}
      >
        <AnimatedSvg width="100%" height="100%" viewBox="0 0 200 200">
          <Defs>
            <SvgLinearGradient id="blobGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={blobColor} stopOpacity={stopOpacity} />
              <Stop offset="100%" stopColor="#000000" stopOpacity={0} />
            </SvgLinearGradient>
          </Defs>
          <Path
            d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,81.6,-46.6C91.4,-34.1,98.1,-19.2,95.8,-5.3C93.5,8.6,82.2,21.5,70.6,31.2C59,40.9,47.1,47.4,35.6,53.8C24.1,60.2,13,66.5,-0.6,67.6C-14.3,68.7,-33.5,64.6,-48.1,56.2C-62.7,47.8,-72.7,35.1,-78.3,20.8C-83.9,6.5,-85.1,-9.4,-78.7,-22.7C-72.3,-36,-58.3,-46.7,-44.6,-54.1C-30.9,-61.5,-17.5,-65.6,-3.2,-60.1C11.1,-54.6,30.5,-83.6,44.7,-76.4Z"
            fill="url(#blobGrad)"
            transform={svgTransform}
          />
        </AnimatedSvg>
      </Animated.View>
    </View>
  );
}
