import React from "react";
import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { useAnimatedStyle, interpolate } from "react-native-reanimated";
import Svg, { Defs, LinearGradient as SvgLinearGradient, Stop, Path } from "react-native-svg";

// Create animated SVG components
const AnimatedSvg = Animated.createAnimatedComponent(Svg);

type BlobVariant = "safe" | "medium" | "hazardous";

interface AnimatedBackgroundProps {
  pulseProgress: Animated.SharedValue<number>;
  colors?: {
    topGradient: [string, string];
    blobGradient: [string, string];
  };
  blobSize?: number; // Size of the animated blob (default: 280)
  variant?: BlobVariant; // Type of blob to display
}

export function AnimatedBackground({ pulseProgress, colors, blobSize = 280, variant = "safe" }: AnimatedBackgroundProps) {
  const defaultColors = {
    topGradient: ["rgba(16, 185, 129, 0.08)", "transparent"] as [string, string],
    blobGradient: ["rgba(5, 150, 105, 0.4)", "rgba(0, 0, 0, 0)"] as [string, string],
  };

  const finalColors = colors || defaultColors;
  const halfSize = blobSize / 2;

  // Determine if we should show SVG blob based on variant
  const showSvgBlob = variant === "hazardous" || variant === "medium";

  // Get SVG gradient color based on variant
  const getSvgGradientColor = () => {
    if (variant === "medium") return "#ea580c"; // Deep orange for medium risk
    if (variant === "hazardous") return "#b91c1c"; // Dark red for hazardous
    return "#10b981"; // Green for safe
  };

  const pulseAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(pulseProgress.value, [0, 1], [0.3, 0.4]),
      transform: [
        {
          scale: interpolate(pulseProgress.value, [0, 1], [1, 1.05]),
        },
      ],
    };
  });

  return (
    <View className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Top gradient - wider for medium/hazardous states */}
      <LinearGradient
        colors={finalColors.topGradient}
        style={{
          position: "absolute",
          top: showSvgBlob ? -80 : 0,
          left: 0,
          right: 0,
          height: showSvgBlob ? "50%" : "40%",
          opacity: showSvgBlob ? 0.6 : 1,
        }}
        pointerEvents="none"
      />

      {/* Center animated blob */}
      {showSvgBlob ? (
        // Organic SVG blob for medium/hazardous states
        <Animated.View
          style={[
            {
              position: "absolute",
              top: "50%",
              left: "50%",
              width: blobSize,
              height: blobSize,
              marginLeft: -halfSize,
              marginTop: -halfSize,
              opacity: variant === "medium" ? 0.5 : 0.4,
            },
            pulseAnimatedStyle,
          ]}
        >
          <AnimatedSvg width="100%" height="100%" viewBox="0 0 200 200">
            <Defs>
              <SvgLinearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor={getSvgGradientColor()} stopOpacity={variant === "medium" ? 0.8 : 1} />
                <Stop offset="100%" stopColor="#000000" stopOpacity="0" />
              </SvgLinearGradient>
            </Defs>
            <Path
              d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,81.6,-46.6C91.4,-34.1,98.1,-19.2,95.8,-5.3C93.5,8.6,82.2,21.5,70.6,31.2C59,40.9,47.1,47.4,35.6,53.8C24.1,60.2,13,66.5,-0.6,67.6C-14.3,68.7,-33.5,64.6,-48.1,56.2C-62.7,47.8,-72.7,35.1,-78.3,20.8C-83.9,6.5,-85.1,-9.4,-78.7,-22.7C-72.3,-36,-58.3,-46.7,-44.6,-54.1C-30.9,-61.5,-17.5,-65.6,-3.2,-60.1C11.1,-54.6,30.5,-83.6,44.7,-76.4Z"
              fill="url(#grad1)"
              transform={`translate(100 100) scale(${variant === "medium" ? 1.15 : 1.1})${variant === "medium" ? " rotate(15)" : ""}`}
            />
          </AnimatedSvg>
        </Animated.View>
      ) : (
        // Simple circular gradient for safe states
        <View
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: blobSize,
            height: blobSize,
            marginLeft: -halfSize,
            marginTop: -halfSize,
            opacity: 0.4,
          }}
        >
          <Animated.View style={[{ width: "100%", height: "100%" }, pulseAnimatedStyle]}>
            <LinearGradient
              colors={finalColors.blobGradient}
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 9999,
              }}
            />
          </Animated.View>
        </View>
      )}
    </View>
  );
}
