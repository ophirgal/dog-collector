import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { CollectionScreen } from './src/screens/CollectionScreen';
import { MapScreen } from './src/screens/MapScreen';
import { CollectionContext, useCollectionState } from './src/storage/collection';

type Tab = 'map' | 'collection';

export default function App() {
  const collection = useCollectionState();
  const [tab, setTab] = useState<Tab>('map');

  return (
    <SafeAreaProvider>
      <CollectionContext.Provider value={collection}>
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
          <View style={styles.screen}>
            {tab === 'map' ? <MapScreen /> : <CollectionScreen />}
          </View>
          <View style={styles.tabBar}>
            <TabButton label="🗺️  Map" active={tab === 'map'} onPress={() => setTab('map')} />
            <TabButton
              label={`🐾  My Dogs (${collection.catches.length})`}
              active={tab === 'collection'}
              onPress={() => setTab('collection')}
            />
          </View>
          <StatusBar style="dark" />
        </SafeAreaView>
      </CollectionContext.Provider>
    </SafeAreaProvider>
  );
}

function TabButton({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable style={styles.tab} onPress={onPress}>
      <Text style={[styles.tabText, active && styles.tabActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  screen: { flex: 1 },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#ddd',
  },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 14 },
  tabText: { fontSize: 15, color: '#999', fontWeight: '600' },
  tabActive: { color: '#E07A5F' },
});
