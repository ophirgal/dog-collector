import { useMemo, useState } from 'react';
import { FlatList, Modal, Pressable, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/AppText';
import { DogArt } from '@/components/DogArt';
import { Icon } from '@/components/Icon';
import { IconButton } from '@/components/ui';
import { BREEDS, type Breed } from '@/data/breeds';
import { colors, fonts, radius } from '@/theme';

type Props = { visible: boolean; onClose: () => void; onPick: (b: Breed) => void };

export function BreedPicker({ visible, onClose, onPick }: Props) {
  const insets = useSafeAreaInsets();
  const [q, setQ] = useState('');
  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    const sorted = BREEDS.slice().sort((a, b) => a.name.localeCompare(b.name));
    return s ? sorted.filter((b) => b.name.toLowerCase().includes(s)) : sorted;
  }, [q]);

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: colors.cream, paddingTop: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, gap: 12 }}>
          <AppText weight="black" size={24} style={{ flex: 1 }}>
            Pick the breed
          </AppText>
          <IconButton name="close" label="Close" onPress={onClose} />
        </View>
        <View
          style={{
            margin: 16,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            backgroundColor: colors.white,
            borderRadius: radius.md,
            paddingHorizontal: 14,
            height: 48,
            borderWidth: 1,
            borderColor: colors.line,
          }}
        >
          <Icon name="search" size={18} color={colors.muted} />
          <TextInput
            value={q}
            onChangeText={setQ}
            placeholder="Search 120 breeds"
            placeholderTextColor={colors.muted}
            autoCorrect={false}
            style={{ flex: 1, fontFamily: fonts.medium, fontSize: 16, color: colors.ink, height: '100%' }}
          />
        </View>
        <FlatList
          data={list}
          keyExtractor={(b) => b.id}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: insets.bottom + 24 }}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => {
                onPick(item);
                setQ('');
              }}
              style={({ pressed }) => ({
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                paddingVertical: 8,
                borderBottomWidth: 1,
                borderBottomColor: colors.line,
                opacity: pressed ? 0.6 : 1,
              })}
            >
              <DogArt look={item.look} size={36} />
              <View style={{ flex: 1 }}>
                <AppText weight="semibold" size={16}>
                  {item.name}
                </AppText>
                <AppText size={12} color={colors.muted}>
                  {item.group}
                </AppText>
              </View>
            </Pressable>
          )}
        />
      </View>
    </Modal>
  );
}
