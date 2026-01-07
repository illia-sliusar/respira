import { useState } from "react";
import { View, Text, Keyboard, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Ionicons } from "@expo/vector-icons";
import { Button, Input, SocialButton } from "@/src/ui";
import { authClient } from "@/src/lib/better-auth-client";
import { loginSchema, type LoginFormData } from "../validation";
import { mockLogin, MOCK_CREDENTIALS } from "../mock-auth";

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    Keyboard.dismiss();
    try {
      // Mock authentication for development
      if (data.email === MOCK_CREDENTIALS.email && data.password === MOCK_CREDENTIALS.password) {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Store mock session
        const success = await mockLogin();

        if (success) {
          // Force reload to trigger Better Auth session detection
          router.replace("/(app)/(tabs)");
        } else {
          alert("Error: Failed to create mock session");
        }
        return;
      }

      const { error } = await authClient.signIn.email({
        email: data.email,
        password: data.password,
      });

      if (error) {
        alert(`Login Failed: ${error.message || "Invalid credentials"}`);
        return;
      }
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
          router.replace("/(app)/(tabs)");
        } else {
          alert("Error: Failed to create mock session");
        }
        setIsLoading(false);
        return;
      }

      await authClient.signIn.social({
        provider,
        callbackURL: "respira://auth/callback",
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
        className="flex-1 px-8"
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          paddingVertical: 48,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo Icon */}
        <View className="mb-12">
          <View className="h-12 w-12 bg-neutral-800 rounded-xl items-center justify-center mb-6">
            <Ionicons name="leaf" size={24} color="#FFFFFF" />
          </View>

          {/* Heading */}
          <Text className="text-3xl font-semibold text-white mb-2 tracking-tight">
            Welcome back
          </Text>

          {/* Subtitle */}
          <Text className="text-base text-neutral-400">
            Sign in to manage your environment and health.
          </Text>
        </View>

        {/* Form Container */}
        <View className="flex flex-col gap-4">
          {/* Email Input */}
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                variant="box"
                placeholder="Email or username"
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

          {/* Forgot Password */}
          <View className="flex justify-end pt-1">
            <TouchableOpacity
              onPress={() => router.push("/(auth)/forgot-password")}
              activeOpacity={0.7}
            >
              <Text className="text-sm font-medium text-neutral-400">Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          {/* Sign In Button */}
          <Button
            title="Sign In"
            onPress={handleSubmit(onSubmit)}
            loading={isLoading}
            fullWidth
            size="lg"
            className="mt-4 bg-white"
          />
        </View>

        {/* Divider */}
        <View className="relative my-10">
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
        <View className="flex flex-row gap-4">
          <SocialButton
            provider="google"
            size="lg"
            variant="rectangular"
            onPress={() => handleSocialSignIn("google")}
            className="bg-neutral-900"
          />
          <SocialButton
            provider="apple"
            size="lg"
            variant="rectangular"
            onPress={() => handleSocialSignIn("apple")}
            className="bg-neutral-900"
          />
        </View>

        {/* Sign Up Link */}
        <View className="mt-auto pt-10 text-center">
          <View className="flex-row items-center justify-center">
            <Text className="text-neutral-500 text-sm">Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/signup")} activeOpacity={0.7}>
              <Text className="text-white font-semibold ml-1 text-sm">
                Sign up
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
