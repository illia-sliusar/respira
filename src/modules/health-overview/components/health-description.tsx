import React from "react";
import { Text } from "react-native";

interface HealthDescriptionProps {
  description: string;
}

export function HealthDescription({ description }: HealthDescriptionProps) {
  return (
    <Text className="text-white/60 text-base leading-relaxed font-light text-center mt-4">
      {description}
    </Text>
  );
}
