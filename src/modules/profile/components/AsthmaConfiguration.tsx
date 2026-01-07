import { View, Text, Switch } from "react-native";
import type { AsthmaConfiguration as AsthmaConfigType } from "../types";

interface AsthmaConfigurationProps {
  config: AsthmaConfigType;
  onUpdate: (config: Partial<AsthmaConfigType>) => void;
}

export function AsthmaConfiguration({ config, onUpdate }: AsthmaConfigurationProps) {
  return (
    <View className="px-6 mt-10 bg-black">
      <Text className="text-white text-sm font-medium uppercase tracking-wider opacity-80 mb-2" style={{ color: '#FFFFFF' }}>
        Asthma Configuration
      </Text>

      <View className="flex-col">
        <View className="flex-row items-center justify-between py-4 border-b border-neutral-800">
          <Text className="text-white text-base font-normal" style={{ color: '#FFFFFF' }}>Exercise Induced</Text>
          <Switch
            value={config.exerciseInduced}
            onValueChange={(value) => onUpdate({ exerciseInduced: value })}
            trackColor={{ false: "#27272a", true: "#FFFFFF" }}
            thumbColor="#FFFFFF"
            ios_backgroundColor="#27272a"
          />
        </View>

        <View className="flex-row items-center justify-between py-4 border-b border-neutral-800">
          <Text className="text-white text-base font-normal" style={{ color: '#FFFFFF' }}>Cold Air Sensitivity</Text>
          <Switch
            value={config.coldAirSensitivity}
            onValueChange={(value) => onUpdate({ coldAirSensitivity: value })}
            trackColor={{ false: "#27272a", true: "#FFFFFF" }}
            thumbColor="#FFFFFF"
            ios_backgroundColor="#27272a"
          />
        </View>

        <View className="flex-row items-center justify-between py-4 border-b border-neutral-800">
          <Text className="text-white text-base font-normal">Thunderstorm Asthma</Text>
          <Switch
            value={config.thunderstormAsthma}
            onValueChange={(value) => onUpdate({ thunderstormAsthma: value })}
            trackColor={{ false: "#27272a", true: "#FFFFFF" }}
            thumbColor="#FFFFFF"
            ios_backgroundColor="#27272a"
          />
        </View>
      </View>
    </View>
  );
}
