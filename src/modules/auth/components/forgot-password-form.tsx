import { useState } from "react";
import { View, Text, Keyboard, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Ionicons } from "@expo/vector-icons";
import { z } from "zod";
import { Button, Input } from "@/src/ui";

const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    Keyboard.dismiss();
    try {
      // TODO: Implement forgot password API call
      // await authClient.resetPassword({ email: data.email });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setIsSubmitted(true);
    } catch (_err) {
      alert(`Error: An unexpected error occurred: ${(_err as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
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
          {/* Success Icon */}
          <View className="items-center mb-12 mt-10">
            <View className="h-16 w-16 bg-neutral-800 rounded-2xl items-center justify-center mb-6">
              <Ionicons name="mail-outline" size={32} color="#FFFFFF" />
            </View>

            {/* Success Message */}
            <Text className="text-3xl font-semibold text-white mb-3 text-center tracking-tight">
              Check your email
            </Text>
            <Text className="text-base text-neutral-400 text-center mb-1">
              We've sent password reset instructions to
            </Text>
            <Text className="text-base text-white font-medium text-center mb-8">
              {getValues("email")}
            </Text>
          </View>

          {/* Actions */}
          <View className="gap-4">
            <Button
              title="Back to Login"
              onPress={() => router.push("/(auth)/login")}
              fullWidth
              size="lg"
              className="bg-white"
            />
          </View>

          {/* Resend Link */}
          <View className="mt-10">
            <View className="flex-row items-center justify-center">
              <Text className="text-sm text-neutral-400">Didn't receive the email? </Text>
              <TouchableOpacity
                onPress={() => setIsSubmitted(false)}
                activeOpacity={0.7}
              >
                <Text className="text-sm text-white font-semibold">Resend</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      {/* Back Button - Fixed at top */}
      <View className="px-8 pt-4">
        <TouchableOpacity
          onPress={() => router.back()}
          className="self-start"
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1 px-8"
        contentContainerStyle={{
          paddingTop: 24,
          paddingBottom: 48,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="mb-8">
          <Text className="text-3xl font-semibold text-white mb-2 tracking-tight">
            Forgot password?
          </Text>
          <Text className="text-base text-neutral-400">
            No worries, we'll send you reset instructions.
          </Text>
        </View>

        {/* Form */}
        <View className="flex flex-col gap-4">
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

          {/* Submit Button */}
          <Button
            title="Reset Password"
            onPress={handleSubmit(onSubmit)}
            loading={isLoading}
            fullWidth
            size="lg"
            className="mt-2 bg-white"
          />
        </View>
      </ScrollView>
    </View>
  );
}
