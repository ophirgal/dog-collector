import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/inter';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { GameProvider, useGame } from '@/state/store';
import { colors } from '@/theme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({ Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, Inter_800ExtraBold });
  return (
    <SafeAreaProvider>
      <GameProvider>
        <StatusBar style="dark" />
        <App ready={loaded || !!error} />
      </GameProvider>
    </SafeAreaProvider>
  );
}

function App({ ready }: { ready: boolean }) {
  const { hydrated } = useGame();
  const show = ready && hydrated;

  useEffect(() => {
    if (show) SplashScreen.hideAsync();
  }, [show]);

  if (!show) return null;

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.cream } }}>
      <Stack.Screen name="snap" options={{ presentation: 'fullScreenModal', animation: 'fade' }} />
      <Stack.Screen name="caught" options={{ presentation: 'fullScreenModal', gestureEnabled: false }} />
      <Stack.Screen name="plus" options={{ presentation: 'modal' }} />
      <Stack.Screen name="winner" options={{ presentation: 'fullScreenModal' }} />
      <Stack.Screen name="stickers" options={{ presentation: 'modal' }} />
    </Stack>
  );
}
