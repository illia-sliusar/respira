import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TermsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-black">
      {/* Header */}
      <View className="px-8 py-4 border-b border-neutral-800">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-white ml-4">Terms of Service</Text>
        </View>
      </View>

      {/* Content */}
      <ScrollView className="flex-1 px-8 py-6" showsVerticalScrollIndicator={false}>
        <Text className="text-2xl font-semibold text-white mb-2">Breathline</Text>
        <Text className="text-sm text-neutral-400 mb-8">Last updated: January 2026</Text>

        {/* Section 1 */}
        <Text className="text-lg font-semibold text-white mb-3">1. About Breathline</Text>
        <Text className="text-base text-neutral-300 mb-2 leading-6">
          Breathline is a personalized environmental insight application designed to help people
          with asthma and allergies understand environmental conditions and plan daily activities
          more comfortably.
        </Text>
        <Text className="text-base text-neutral-300 mb-6 leading-6">
          The App analyzes air quality, pollen, weather data, and user-provided information to
          generate informational scores and lifestyle guidance.
        </Text>

        {/* Section 2 */}
        <Text className="text-lg font-semibold text-white mb-3">2. No Medical Advice</Text>
        <Text className="text-base text-neutral-300 mb-2 leading-6">
          Breathline is not a medical device and does not provide medical advice, diagnosis, or
          treatment.
        </Text>
        <Text className="text-base text-neutral-300 mb-2 leading-6">
          All scores, insights, and recommendations:
        </Text>
        <Text className="text-base text-neutral-300 mb-1 leading-6 ml-4">
          • are informational and educational only
        </Text>
        <Text className="text-base text-neutral-300 mb-1 leading-6 ml-4">
          • are based on environmental forecasts and user input
        </Text>
        <Text className="text-base text-neutral-300 mb-2 leading-6 ml-4">
          • should not replace professional medical advice
        </Text>
        <Text className="text-base text-neutral-300 mb-6 leading-6">
          Always consult a qualified healthcare provider regarding any medical condition.
        </Text>

        {/* Section 3 */}
        <Text className="text-lg font-semibold text-white mb-3">3. Intended Use</Text>
        <Text className="text-base text-neutral-300 mb-2 leading-6">
          Breathline is intended to:
        </Text>
        <Text className="text-base text-neutral-300 mb-1 leading-6 ml-4">
          • help users understand environmental comfort for breathing
        </Text>
        <Text className="text-base text-neutral-300 mb-1 leading-6 ml-4">
          • support planning of outdoor activities
        </Text>
        <Text className="text-base text-neutral-300 mb-2 leading-6 ml-4">
          • provide general preventive and lifestyle guidance
        </Text>
        <Text className="text-base text-neutral-300 mb-6 leading-6">
          Breathline is not intended for emergency situations or acute medical decision-making.
        </Text>

        {/* Section 4 */}
        <Text className="text-lg font-semibold text-white mb-3">4. User Responsibilities</Text>
        <Text className="text-base text-neutral-300 mb-2 leading-6">You agree to:</Text>
        <Text className="text-base text-neutral-300 mb-1 leading-6 ml-4">
          • provide accurate and truthful information in your health profile
        </Text>
        <Text className="text-base text-neutral-300 mb-1 leading-6 ml-4">
          • understand that environmental data is predictive and may be imperfect
        </Text>
        <Text className="text-base text-neutral-300 mb-3 leading-6 ml-4">
          • use the App for personal, non-commercial purposes
        </Text>
        <Text className="text-base text-neutral-300 mb-2 leading-6">You must not:</Text>
        <Text className="text-base text-neutral-300 mb-1 leading-6 ml-4">
          • rely on the App for medical emergencies
        </Text>
        <Text className="text-base text-neutral-300 mb-6 leading-6 ml-4">
          • attempt to reverse engineer or misuse the system
        </Text>

        {/* Section 5 */}
        <Text className="text-lg font-semibold text-white mb-3">
          5. Environmental Data Disclaimer
        </Text>
        <Text className="text-base text-neutral-300 mb-2 leading-6">
          Breathline relies on third-party environmental and weather data sources. Forecasts may
          change rapidly due to natural conditions.
        </Text>
        <Text className="text-base text-neutral-300 mb-2 leading-6">We do not guarantee:</Text>
        <Text className="text-base text-neutral-300 mb-1 leading-6 ml-4">
          • real-time accuracy
        </Text>
        <Text className="text-base text-neutral-300 mb-1 leading-6 ml-4">
          • completeness of environmental data
        </Text>
        <Text className="text-base text-neutral-300 mb-6 leading-6 ml-4">
          • absence of errors or delays
        </Text>

        {/* Section 6 */}
        <Text className="text-lg font-semibold text-white mb-3">6. Account & Availability</Text>
        <Text className="text-base text-neutral-300 mb-2 leading-6">We may:</Text>
        <Text className="text-base text-neutral-300 mb-1 leading-6 ml-4">
          • update, modify, or discontinue features
        </Text>
        <Text className="text-base text-neutral-300 mb-3 leading-6 ml-4">
          • temporarily suspend service for maintenance
        </Text>
        <Text className="text-base text-neutral-300 mb-6 leading-6">
          We are not responsible for service interruptions beyond reasonable control.
        </Text>

        {/* Section 7 */}
        <Text className="text-lg font-semibold text-white mb-3">7. Limitation of Liability</Text>
        <Text className="text-base text-neutral-300 mb-2 leading-6">
          To the maximum extent permitted by law, Breathline is not liable for:
        </Text>
        <Text className="text-base text-neutral-300 mb-1 leading-6 ml-4">
          • health outcomes or symptom changes
        </Text>
        <Text className="text-base text-neutral-300 mb-1 leading-6 ml-4">
          • decisions made based on App information
        </Text>
        <Text className="text-base text-neutral-300 mb-2 leading-6 ml-4">
          • indirect or consequential damages
        </Text>
        <Text className="text-base text-neutral-300 mb-6 leading-6">
          Use of the App is at your own discretion.
        </Text>

        {/* Section 8 */}
        <Text className="text-lg font-semibold text-white mb-3">8. Changes to Terms</Text>
        <Text className="text-base text-neutral-300 mb-6 leading-6">
          We may update these Terms periodically. Continued use of the App constitutes acceptance
          of updated Terms.
        </Text>

        {/* Section 9 */}
        <Text className="text-lg font-semibold text-white mb-3">9. Contact</Text>
        <Text className="text-base text-neutral-300 mb-12 leading-6">
          📧 support@breathline.app
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
