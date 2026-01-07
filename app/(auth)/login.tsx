import React from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LoginForm } from "@/src/modules/auth";

export default function LoginScreen() {
  return (
    <SafeAreaView className="flex-1 bg-black">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <LoginForm />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
