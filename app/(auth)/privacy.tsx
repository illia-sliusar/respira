import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function PrivacyScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-black">
      {/* Header */}
      <View className="px-8 py-4 border-b border-neutral-800">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-white ml-4">Privacy Policy</Text>
        </View>
      </View>

      {/* Content */}
      <ScrollView className="flex-1 px-8 py-6" showsVerticalScrollIndicator={false}>
        <Text className="text-2xl font-semibold text-white mb-2">Breathline</Text>
        <Text className="text-sm text-neutral-400 mb-8">Last updated: January 2026</Text>

        {/* Section 1 */}
        <Text className="text-lg font-semibold text-white mb-3">1. Overview</Text>
        <Text className="text-base text-neutral-300 mb-2 leading-6">
          Breathline respects your privacy and is designed with privacy-by-design principles.
        </Text>
        <Text className="text-base text-neutral-300 mb-6 leading-6">
          This Policy explains how we collect, use, and protect your data.
        </Text>

        {/* Section 2 */}
        <Text className="text-lg font-semibold text-white mb-3">2. Data We Collect</Text>
        <Text className="text-base font-semibold text-white mb-2">2.1 Data You Provide</Text>
        <Text className="text-base text-neutral-300 mb-1 leading-6 ml-4">
          • Health profile information (e.g. asthma status, allergy types, sensitivity level)
        </Text>
        <Text className="text-base text-neutral-300 mb-1 leading-6 ml-4">
          • Location at city or approximate level
        </Text>
        <Text className="text-base text-neutral-300 mb-3 leading-6 ml-4">
          • Account data (email, authentication method)
        </Text>
        <Text className="text-base text-neutral-300 mb-4 leading-6">
          We do not require precise GPS unless explicitly enabled by the user.
        </Text>

        <Text className="text-base font-semibold text-white mb-2">
          2.2 Automatically Collected Data
        </Text>
        <Text className="text-base text-neutral-300 mb-1 leading-6 ml-4">
          • App usage events (for performance and UX improvement)
        </Text>
        <Text className="text-base text-neutral-300 mb-1 leading-6 ml-4">
          • Device and operating system information
        </Text>
        <Text className="text-base text-neutral-300 mb-6 leading-6 ml-4">
          • Approximate location for environmental forecasts
        </Text>

        {/* Section 3 */}
        <Text className="text-lg font-semibold text-white mb-3">3. Health-Related Data</Text>
        <Text className="text-base text-neutral-300 mb-2 leading-6">
          Health profile data is:
        </Text>
        <Text className="text-base text-neutral-300 mb-1 leading-6 ml-4">
          • optional but required for personalization
        </Text>
        <Text className="text-base text-neutral-300 mb-1 leading-6 ml-4">
          • used only to compute personalized scores and advice
        </Text>
        <Text className="text-base text-neutral-300 mb-3 leading-6 ml-4">
          • encrypted at rest
        </Text>
        <Text className="text-base text-neutral-300 mb-6 leading-6">
          Breathline does not interpret health data diagnostically.
        </Text>

        {/* Section 4 */}
        <Text className="text-lg font-semibold text-white mb-3">4. How We Use Data</Text>
        <Text className="text-base text-neutral-300 mb-2 leading-6">We use data to:</Text>
        <Text className="text-base text-neutral-300 mb-1 leading-6 ml-4">
          • calculate personalized breathing comfort scores
        </Text>
        <Text className="text-base text-neutral-300 mb-1 leading-6 ml-4">
          • generate contextual lifestyle advice
        </Text>
        <Text className="text-base text-neutral-300 mb-1 leading-6 ml-4">
          • improve product quality and reliability
        </Text>
        <Text className="text-base text-neutral-300 mb-3 leading-6 ml-4">
          • provide user support
        </Text>
        <Text className="text-base text-neutral-300 mb-6 leading-6">
          We do not use personal data for advertising or profiling.
        </Text>

        {/* Section 5 */}
        <Text className="text-lg font-semibold text-white mb-3">5. Data Sharing</Text>
        <Text className="text-base text-neutral-300 mb-2 leading-6">
          We may share limited data with:
        </Text>
        <Text className="text-base text-neutral-300 mb-1 leading-6 ml-4">
          • cloud infrastructure providers
        </Text>
        <Text className="text-base text-neutral-300 mb-3 leading-6 ml-4">
          • analytics tools (aggregated, anonymized only)
        </Text>
        <Text className="text-base text-neutral-300 mb-6 leading-6">
          We never sell personal or health-related data.
        </Text>

        {/* Section 6 */}
        <Text className="text-lg font-semibold text-white mb-3">6. Data Retention</Text>
        <Text className="text-base text-neutral-300 mb-2 leading-6">
          We retain data only as long as necessary to:
        </Text>
        <Text className="text-base text-neutral-300 mb-1 leading-6 ml-4">
          • provide the service
        </Text>
        <Text className="text-base text-neutral-300 mb-3 leading-6 ml-4">
          • comply with legal obligations
        </Text>
        <Text className="text-base text-neutral-300 mb-6 leading-6">
          You may request deletion of your data at any time.
        </Text>

        {/* Section 7 */}
        <Text className="text-lg font-semibold text-white mb-3">
          7. Your Rights (GDPR & Privacy Rights)
        </Text>
        <Text className="text-base text-neutral-300 mb-2 leading-6">
          You have the right to:
        </Text>
        <Text className="text-base text-neutral-300 mb-1 leading-6 ml-4">
          • access your data
        </Text>
        <Text className="text-base text-neutral-300 mb-1 leading-6 ml-4">
          • correct inaccurate information
        </Text>
        <Text className="text-base text-neutral-300 mb-1 leading-6 ml-4">
          • request deletion
        </Text>
        <Text className="text-base text-neutral-300 mb-3 leading-6 ml-4">
          • withdraw consent
        </Text>
        <Text className="text-base text-neutral-300 mb-6 leading-6">
          📧 privacy@breathline.app
        </Text>

        {/* Section 8 */}
        <Text className="text-lg font-semibold text-white mb-3">8. Security</Text>
        <Text className="text-base text-neutral-300 mb-2 leading-6">
          We implement technical and organizational measures to protect your data.
        </Text>
        <Text className="text-base text-neutral-300 mb-6 leading-6">
          No system is completely secure, but we continuously improve safeguards.
        </Text>

        {/* Section 9 */}
        <Text className="text-lg font-semibold text-white mb-3">9. Children's Privacy</Text>
        <Text className="text-base text-neutral-300 mb-6 leading-6">
          Breathline is not intended for users under 16 without parental consent.
        </Text>

        {/* Section 10 */}
        <Text className="text-lg font-semibold text-white mb-3">10. Policy Updates</Text>
        <Text className="text-base text-neutral-300 mb-12 leading-6">
          We may update this Policy from time to time. Significant changes will be communicated in
          the App.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
