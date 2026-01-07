import React from "react";
import { Text, TextStyle } from "react-native";
import { useFonts } from "expo-font";

interface MaterialSymbolProps {
  name: string;
  size?: number;
  color?: string;
  style?: TextStyle;
}

/**
 * Material Symbols Outlined icon component
 * Uses the Material Symbols Outlined font from Google
 */
export function MaterialSymbol({ name, size = 24, color = "#000", style }: MaterialSymbolProps) {
  const [fontsLoaded] = useFonts({
    MaterialSymbolsOutlined: require("../../assets/fonts/MaterialSymbolsOutlined.ttf"),
  });

  if (!fontsLoaded) {
    // Return empty view while font is loading
    return <Text style={{ width: size, height: size }} />;
  }

  return (
    <Text
      style={[
        {
          fontFamily: "MaterialSymbolsOutlined",
          fontSize: size,
          color: color,
          fontWeight: "400" as any,
          fontStyle: "normal",
        },
        style,
      ]}
    >
      {name}
    </Text>
  );
}
