import React from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SignupForm } from "@/src/modules/auth";

export default function SignupScreen() {
  return (
    <SafeAreaView className="flex-1 bg-black">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <SignupForm />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
