import { useState } from "react";
import { View, Text, Keyboard, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MaterialIcons } from "@expo/vector-icons";
import { Button, Input, SocialButton } from "@/src/ui";
import { authClient } from "@/src/lib/better-auth-client";
import { signupSchema, type SignupFormData } from "../validation";
import { mockLogin } from "../mock-auth";

export function SignupForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    Keyboard.dismiss();
    try {
      const { error } = await authClient.signUp.email({
        email: data.email,
        password: data.password,
        name: data.email.split("@")[0], // Use email prefix as name
      });

      if (error) {
        alert(`Signup Failed: ${error.message || "Unable to create account"}`);
        return;
      }

      // Navigate to app after successful signup
      router.replace("/");
    } catch (_err) {
      alert(`Error: An unexpected error occurred: ${(_err as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignIn = async (provider: "google" | "apple") => {
    setIsLoading(true);
    try {
      // Mock authentication for development - Apple sign in
      if (provider === "apple") {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const success = await mockLogin();
        if (success) {
          // Navigate to app - the routing guard will pick up the session
          router.replace("/");
        } else {
          alert("Error: Failed to create mock session");
        }
        setIsLoading(false);
        return;
      }

      await authClient.signIn.social({
        provider,
        callbackURL: "tsmobile://auth/callback",
      });
    } catch (_err) {
      alert(`Error: ${provider} sign in failed`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-black">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          paddingHorizontal: 24,
          paddingVertical: 40,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with Icon */}
        <View className="flex flex-col mb-10 pt-10">
          <View className="h-16 w-16 bg-white rounded-2xl items-center justify-center mb-6 shadow-lg">
            <MaterialIcons name="medical-services" size={32} color="#000000" />
          </View>
          <Text className="text-3xl font-semibold tracking-tight text-white mb-2">
            Create Account
          </Text>
          <Text className="text-neutral-400 text-sm">
            Join us to personalize your asthma & allergy insights.
          </Text>
        </View>

        {/* Form Fields */}
        <View className="flex flex-col gap-4 w-full">
          {/* Email Input */}
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                variant="box"
                placeholder="Email address"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.email?.message}
                containerClassName="mb-0"
              />
            )}
          />

          {/* Password Input */}
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                variant="box"
                placeholder="Password"
                secureTextEntry
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.password?.message}
                containerClassName="mb-0"
              />
            )}
          />

          {/* Confirm Password Input */}
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                variant="box"
                placeholder="Confirm Password"
                secureTextEntry
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.confirmPassword?.message}
                containerClassName="mb-0"
              />
            )}
          />

          {/* Sign Up Button */}
          <Button
            title="Sign Up"
            onPress={handleSubmit(onSubmit)}
            loading={isLoading}
            fullWidth
            size="lg"
            className="mt-4 bg-white"
          />
        </View>

        {/* Divider */}
        <View className="relative mt-8 mb-6">
          <View className="absolute inset-0 flex-row items-center">
            <View className="flex-1 h-[1px] bg-neutral-700" />
          </View>
          <View className="relative flex-row justify-center">
            <View className="bg-black px-4">
              <Text className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                Or continue with
              </Text>
            </View>
          </View>
        </View>

        {/* Social Buttons */}
        <View className="flex-row gap-4">
          <View className="flex-1">
            <SocialButton
              provider="google"
              size="lg"
              variant="rectangular"
              showLabel
              onPress={() => handleSocialSignIn("google")}
              className="bg-surface-secondary w-full"
            />
          </View>
          <View className="flex-1">
            <SocialButton
              provider="apple"
              size="lg"
              variant="rectangular"
              showLabel
              onPress={() => handleSocialSignIn("apple")}
              className="bg-surface-secondary w-full"
            />
          </View>
        </View>

        {/* Log In Link */}
        <View className="mt-10">
          <View className="flex-row items-center justify-center">
            <Text className="text-sm text-neutral-400">Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/login")} activeOpacity={0.7}>
              <Text className="text-sm text-white font-semibold">Log in</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Terms & Privacy */}
        <View className="mt-auto py-6">
          <Text className="text-xs text-neutral-600 text-center">
            By signing up, you agree to our{" "}
            <Text className="underline" onPress={() => router.push("/(auth)/terms")}>
              Terms
            </Text>{" "}
            &{" "}
            <Text className="underline" onPress={() => router.push("/(auth)/privacy")}>
              Privacy Policy
            </Text>
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
