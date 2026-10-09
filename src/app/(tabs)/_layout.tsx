import { Redirect } from 'expo-router';
import { Tabs } from 'expo-router/tabs';

import { TabBar } from '@/components/TabBar';
import { useGame } from '@/state/store';
import { useRecordTopDogWins } from '@/state/useTopDog';

export default function TabsLayout() {
  const { state } = useGame();
  useRecordTopDogWins();
  if (!state.username) return <Redirect href="/welcome" />;

  return (
    <Tabs tabBar={(props) => <TabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="map" />
      <Tabs.Screen name="feed" />
      <Tabs.Screen name="top-dog" />
      <Tabs.Screen name="pack" />
    </Tabs>
  );
}
