import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { API_URL } from "@/src/lib/constants";

type PollenLevel = 0 | 1 | 2 | 3 | 4;

interface PollenData {
  tree: {
    level: PollenLevel;
    types: Record<string, PollenLevel | undefined>;
  };
  grass: {
    level: PollenLevel;
    types: Record<string, PollenLevel | undefined>;
  };
  weed: {
    level: PollenLevel;
    types: Record<string, PollenLevel | undefined>;
  };
  mold?: {
    level: PollenLevel;
    types: Record<string, PollenLevel | undefined>;
  };
  overallIndex: number;
  season: string;
  dominantAllergen?: string;
}

interface HealthMetrics {
  id: string;
  score: number;
  riskLevel: string;
  condition: string;
  description: string;
  location: string;
  timestamp: string;
  aqi: number;
  temperature?: number;
  humidity?: number;
  pollutants?: {
    pm25?: number;
    pm10?: number;
    o3?: number;
    no2?: number;
    so2?: number;
    co?: number;
  };
  pollen?: PollenData;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

interface ApiStatus {
  status: string;
  timestamp: string;
  services: {
    ads: {
      connected: boolean;
      url: string;
    };
  };
}

export default function ApiTestScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [healthData, setHealthData] = useState<HealthMetrics | null>(null);
  const [historyData, setHistoryData] = useState<HealthMetrics[] | null>(null);
  const [statusData, setStatusData] = useState<ApiStatus | null>(null);
  const [lastEndpoint, setLastEndpoint] = useState<string>("");

  const baseUrl = API_URL || "http://192.168.10.92:3000";

  const fetchData = async (endpoint: string, setter: (data: any) => void) => {
    setLoading(true);
    setError(null);
    setLastEndpoint(endpoint);

    try {
      const url = `${baseUrl}${endpoint}`;
      console.log("Fetching:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setter(data);
      console.log("Response:", JSON.stringify(data, null, 2));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      console.error("Fetch error:", message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchCurrentHealth = () => {
    setHistoryData(null);
    setStatusData(null);
    fetchData(
      "/api/health/current?latitude=37.7749&longitude=-122.4194&location=San%20Francisco",
      setHealthData
    );
  };

  const fetchHealthHistory = () => {
    setHealthData(null);
    setStatusData(null);
    fetchData("/api/health/history?location=San%20Francisco", setHistoryData);
  };

  const fetchByLocation = (location: string) => {
    setHistoryData(null);
    setStatusData(null);
    fetchData(`/api/health/location/${encodeURIComponent(location)}`, setHealthData);
  };

  const fetchStatus = () => {
    setHealthData(null);
    setHistoryData(null);
    fetchData("/api/health/status", setStatusData);
  };

  const onRefresh = () => {
    setRefreshing(true);
    if (lastEndpoint) {
      if (lastEndpoint.includes("history")) {
        fetchHealthHistory();
      } else if (lastEndpoint.includes("status")) {
        fetchStatus();
      } else {
        fetchCurrentHealth();
      }
    } else {
      fetchCurrentHealth();
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return "#10b981"; // green
    if (score >= 6) return "#f59e0b"; // yellow
    if (score >= 4) return "#f97316"; // orange
    return "#ef4444"; // red
  };

  const getPollenLevelText = (level: PollenLevel) => {
    const labels = ["None", "Low", "Moderate", "High", "Very High"];
    return labels[level] || "Unknown";
  };

  const getPollenLevelColor = (level: PollenLevel) => {
    const colors = ["#6b7280", "#10b981", "#f59e0b", "#f97316", "#ef4444"];
    return colors[level] || "#6b7280";
  };

  const renderPollenCategory = (
    name: string,
    level: PollenLevel,
    types: Record<string, PollenLevel | undefined>
  ) => {
    const activeTypes = Object.entries(types).filter(([_, v]) => v !== undefined && v > 0);

    return (
      <View key={name} className="mb-3">
        <View className="flex-row items-center justify-between mb-1">
          <Text className="text-neutral-300 font-medium capitalize">{name}</Text>
          <View
            className="px-2 py-0.5 rounded"
            style={{ backgroundColor: getPollenLevelColor(level) + "30" }}
          >
            <Text style={{ color: getPollenLevelColor(level) }} className="text-xs font-medium">
              {getPollenLevelText(level)}
            </Text>
          </View>
        </View>
        {activeTypes.length > 0 && (
          <View className="flex-row flex-wrap gap-1 mt-1">
            {activeTypes.map(([type, typeLevel]) => (
              <View
                key={type}
                className="px-2 py-0.5 rounded-full"
                style={{ backgroundColor: getPollenLevelColor(typeLevel!) + "20" }}
              >
                <Text className="text-neutral-400 text-xs capitalize">
                  {type}: {typeLevel}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  const renderHealthCard = (data: HealthMetrics, index?: number) => (
    <View
      key={data.id || index}
      className="bg-neutral-900 rounded-2xl p-4 mb-3"
      style={{ borderLeftWidth: 4, borderLeftColor: getScoreColor(data.score) }}
    >
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-white text-lg font-semibold">{data.location}</Text>
        <View
          className="px-3 py-1 rounded-full"
          style={{ backgroundColor: getScoreColor(data.score) + "20" }}
        >
          <Text style={{ color: getScoreColor(data.score) }} className="font-bold">
            Score: {data.score}/10
          </Text>
        </View>
      </View>

      <View className="flex-row justify-between mb-2">
        <Text className="text-neutral-400">AQI: {data.aqi}</Text>
        <Text className="text-neutral-400">{data.riskLevel}</Text>
      </View>

      <Text className="text-neutral-300 mb-3">{data.description}</Text>

      {data.pollutants && (
        <View className="bg-neutral-800 rounded-xl p-3">
          <Text className="text-neutral-400 text-xs mb-2 uppercase">Pollutants (μg/m³)</Text>
          <View className="flex-row flex-wrap">
            {data.pollutants.pm25 !== undefined && (
              <View className="w-1/3 mb-2">
                <Text className="text-neutral-500 text-xs">PM2.5</Text>
                <Text className="text-white font-medium">{data.pollutants.pm25}</Text>
              </View>
            )}
            {data.pollutants.pm10 !== undefined && (
              <View className="w-1/3 mb-2">
                <Text className="text-neutral-500 text-xs">PM10</Text>
                <Text className="text-white font-medium">{data.pollutants.pm10}</Text>
              </View>
            )}
            {data.pollutants.o3 !== undefined && (
              <View className="w-1/3 mb-2">
                <Text className="text-neutral-500 text-xs">O₃</Text>
                <Text className="text-white font-medium">{data.pollutants.o3}</Text>
              </View>
            )}
            {data.pollutants.no2 !== undefined && (
              <View className="w-1/3 mb-2">
                <Text className="text-neutral-500 text-xs">NO₂</Text>
                <Text className="text-white font-medium">{data.pollutants.no2}</Text>
              </View>
            )}
            {data.pollutants.so2 !== undefined && (
              <View className="w-1/3 mb-2">
                <Text className="text-neutral-500 text-xs">SO₂</Text>
                <Text className="text-white font-medium">{data.pollutants.so2}</Text>
              </View>
            )}
            {data.pollutants.co !== undefined && (
              <View className="w-1/3 mb-2">
                <Text className="text-neutral-500 text-xs">CO</Text>
                <Text className="text-white font-medium">{data.pollutants.co}</Text>
              </View>
            )}
          </View>
        </View>
      )}

      {/* Pollen Data */}
      {data.pollen && (
        <View className="bg-neutral-800 rounded-xl p-3 mt-3">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-neutral-400 text-xs uppercase">Pollen & Allergens</Text>
            <View className="flex-row items-center">
              <Text className="text-neutral-500 text-xs mr-2">
                {data.pollen.season.charAt(0).toUpperCase() + data.pollen.season.slice(1)}
              </Text>
              <View
                className="px-2 py-0.5 rounded"
                style={{
                  backgroundColor:
                    getPollenLevelColor(
                      Math.min(4, Math.round(data.pollen.overallIndex / 2.5)) as PollenLevel
                    ) + "30",
                }}
              >
                <Text
                  style={{
                    color: getPollenLevelColor(
                      Math.min(4, Math.round(data.pollen.overallIndex / 2.5)) as PollenLevel
                    ),
                  }}
                  className="text-xs font-medium"
                >
                  Index: {data.pollen.overallIndex}/10
                </Text>
              </View>
            </View>
          </View>

          {data.pollen.dominantAllergen && data.pollen.dominantAllergen !== "None" && (
            <View className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-2 mb-3">
              <Text className="text-yellow-400 text-xs">
                ⚠️ Dominant: {data.pollen.dominantAllergen}
              </Text>
            </View>
          )}

          {renderPollenCategory("Tree Pollen", data.pollen.tree.level, data.pollen.tree.types)}
          {renderPollenCategory("Grass Pollen", data.pollen.grass.level, data.pollen.grass.types)}
          {renderPollenCategory("Weed Pollen", data.pollen.weed.level, data.pollen.weed.types)}
          {data.pollen.mold &&
            renderPollenCategory("Mold Spores", data.pollen.mold.level, data.pollen.mold.types)}
        </View>
      )}

      <Text className="text-neutral-500 text-xs mt-2">
        {new Date(data.timestamp).toLocaleString()}
      </Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-black">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-neutral-800">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-xl font-semibold">API Test</Text>
      </View>

      <ScrollView
        className="flex-1 px-4"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* API URL Info */}
        <View className="bg-neutral-900 rounded-xl p-3 mt-4 mb-4">
          <Text className="text-neutral-400 text-xs">API Base URL</Text>
          <Text className="text-white font-mono text-sm">{baseUrl}</Text>
        </View>

        {/* Action Buttons */}
        <Text className="text-neutral-400 text-sm mb-2 uppercase">Endpoints</Text>
        <View className="flex-row flex-wrap gap-2 mb-4">
          <TouchableOpacity
            onPress={fetchCurrentHealth}
            disabled={loading}
            className="bg-blue-600 px-4 py-2 rounded-lg"
          >
            <Text className="text-white font-medium">Current Health</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={fetchHealthHistory}
            disabled={loading}
            className="bg-purple-600 px-4 py-2 rounded-lg"
          >
            <Text className="text-white font-medium">History</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={fetchStatus}
            disabled={loading}
            className="bg-green-600 px-4 py-2 rounded-lg"
          >
            <Text className="text-white font-medium">Status</Text>
          </TouchableOpacity>
        </View>

        {/* Location Buttons */}
        <Text className="text-neutral-400 text-sm mb-2 uppercase">By Location</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
          <View className="flex-row gap-2">
            {["San Francisco", "New York", "London", "Tokyo", "Kyiv", "Paris"].map((city) => (
              <TouchableOpacity
                key={city}
                onPress={() => fetchByLocation(city)}
                disabled={loading}
                className="bg-neutral-800 px-4 py-2 rounded-lg"
              >
                <Text className="text-white">{city}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Loading State */}
        {loading && (
          <View className="items-center py-8">
            <ActivityIndicator size="large" color="#3b82f6" />
            <Text className="text-neutral-400 mt-2">Loading...</Text>
          </View>
        )}

        {/* Error State */}
        {error && (
          <View className="bg-red-900/30 border border-red-500 rounded-xl p-4 mb-4">
            <Text className="text-red-400 font-semibold mb-1">Error</Text>
            <Text className="text-red-300">{error}</Text>
            <Text className="text-red-400/60 text-xs mt-2">Endpoint: {lastEndpoint}</Text>
          </View>
        )}

        {/* Health Data */}
        {healthData && !loading && (
          <View className="mb-4">
            <Text className="text-neutral-400 text-sm mb-2 uppercase">Current Health Data</Text>
            {renderHealthCard(healthData)}
          </View>
        )}

        {/* History Data */}
        {historyData && !loading && (
          <View className="mb-4">
            <Text className="text-neutral-400 text-sm mb-2 uppercase">
              Health History ({historyData.length} days)
            </Text>
            {historyData.map((item, index) => renderHealthCard(item, index))}
          </View>
        )}

        {/* Status Data */}
        {statusData && !loading && (
          <View className="mb-4">
            <Text className="text-neutral-400 text-sm mb-2 uppercase">API Status</Text>
            <View className="bg-neutral-900 rounded-xl p-4">
              <View className="flex-row items-center mb-2">
                <View
                  className={`w-3 h-3 rounded-full mr-2 ${
                    statusData.status === "ok" ? "bg-green-500" : "bg-red-500"
                  }`}
                />
                <Text className="text-white font-semibold">
                  Status: {statusData.status.toUpperCase()}
                </Text>
              </View>
              <Text className="text-neutral-400 text-sm mb-3">
                {new Date(statusData.timestamp).toLocaleString()}
              </Text>

              <View className="bg-neutral-800 rounded-lg p-3">
                <Text className="text-neutral-400 text-xs mb-1">ADS Service</Text>
                <View className="flex-row items-center">
                  <View
                    className={`w-2 h-2 rounded-full mr-2 ${
                      statusData.services.ads.connected ? "bg-green-500" : "bg-yellow-500"
                    }`}
                  />
                  <Text className="text-white">
                    {statusData.services.ads.connected ? "Connected" : "Using Fallback"}
                  </Text>
                </View>
                <Text className="text-neutral-500 text-xs mt-1 font-mono">
                  {statusData.services.ads.url}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Empty State */}
        {!loading && !error && !healthData && !historyData && !statusData && (
          <View className="items-center py-12">
            <Ionicons name="cloud-outline" size={48} color="#525252" />
            <Text className="text-neutral-500 mt-3">Tap a button to test the API</Text>
          </View>
        )}

        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}
