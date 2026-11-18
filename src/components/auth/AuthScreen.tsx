import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { Easing, FadeInDown } from 'react-native-reanimated';

import { AuthHeader } from './AuthHeader';
import { SiteFooter } from './SiteFooter';

type AuthScreenProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export function AuthScreen({ title, description = '', children }: AuthScreenProps) {
  return (
    <SafeAreaView className="flex-1 bg-[#080500]" edges={['left', 'right', 'bottom']}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View className="flex-1 bg-white">
            <SafeAreaView className="bg-white" edges={['top']}>
              <AuthHeader />
            </SafeAreaView>
            <View className="flex-1 items-center justify-center px-6 py-8">
              <Animated.View
                entering={FadeInDown.duration(420).easing(Easing.linear)}
                className="w-full max-w-[340px]">
                <View className="mb-[22px] items-center">
                  <Text
                      className="text-center text-[30px] font-extrabold leading-[38px] tracking-[-0.8px] text-[#191919]"
                    style={{ fontFamily: 'Arial' }}>
                    {title}
                  </Text>
                  {description ? (
                    <Text
                      className="mt-2 text-center text-[14px] leading-5 text-[#555555]"
                      style={{ fontFamily: 'Arial' }}>
                      {description}
                    </Text>
                  ) : null}
                </View>
                {children}
              </Animated.View>
            </View>
            <SiteFooter />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
