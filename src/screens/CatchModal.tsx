import { useEffect, useState } from 'react';
import { Animated, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { DogBadge } from '../components/DogBadge';
import { RARITY_LABEL } from '../data/breeds';
import type { Spawn } from '../game/spawns';

type Props = {
  spawn: Spawn | null;
  onCatch: (spawn: Spawn) => void;
  onClose: () => void;
};

export function CatchModal({ spawn, onCatch, onClose }: Props) {
  const [flip] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (!spawn) return;
    flip.setValue(0);
    Animated.spring(flip, { toValue: 1, friction: 6, useNativeDriver: true }).start();
  }, [spawn, flip]);

  if (!spawn) return null;

  const rotateY = flip.interpolate({ inputRange: [0, 1], outputRange: ['90deg', '0deg'] });

  return (
    <Modal transparent animationType="fade" visible onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Animated.View style={[styles.card, { transform: [{ perspective: 800 }, { rotateY }] }]}>
          <Text style={[styles.rarity, rarityStyle[spawn.breed.rarity]]}>
            {RARITY_LABEL[spawn.breed.rarity]}
          </Text>
          <DogBadge breed={spawn.breed} size={120} />
          <Text style={styles.name}>{spawn.name}</Text>
          <Text style={styles.breed}>{spawn.breed.name}</Text>
          <Pressable
            style={styles.catchButton}
            onPress={() => {
              onCatch(spawn);
              onClose();
            }}
          >
            <Text style={styles.catchText}>Catch!</Text>
          </Pressable>
          <Pressable onPress={onClose} hitSlop={12}>
            <Text style={styles.cancel}>Let them go</Text>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
}

const rarityStyle = StyleSheet.create({
  common: { backgroundColor: '#E9ECEF', color: '#495057' },
  uncommon: { backgroundColor: '#D3F9D8', color: '#2B8A3E' },
  rare: { backgroundColor: '#FFE8CC', color: '#D9480F' },
});

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: 280,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingVertical: 28,
    paddingHorizontal: 20,
    gap: 8,
  },
  rarity: {
    fontSize: 12,
    fontWeight: '700',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 8,
  },
  name: { fontSize: 26, fontWeight: '800', marginTop: 8 },
  breed: { fontSize: 16, color: '#666' },
  catchButton: {
    marginTop: 16,
    backgroundColor: '#E07A5F',
    paddingHorizontal: 48,
    paddingVertical: 14,
    borderRadius: 28,
  },
  catchText: { color: '#fff', fontSize: 18, fontWeight: '800' },
  cancel: { color: '#888', marginTop: 8 },
});
