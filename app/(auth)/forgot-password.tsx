import React from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ForgotPasswordForm } from "@/src/modules/auth";

export default function ForgotPasswordScreen() {
  return (
    <SafeAreaView className="flex-1 bg-black">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ForgotPasswordForm />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
