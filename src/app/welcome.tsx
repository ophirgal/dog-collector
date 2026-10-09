import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/AppText';
import { DogArt } from '@/components/DogArt';
import { Button } from '@/components/ui';
import { getBreed } from '@/data/breeds';
import { checkUsername } from '@/game/username';
import { useGame } from '@/state/store';
import { colors, fonts, radius } from '@/theme';

export default function Welcome() {
  const insets = useSafeAreaInsets();
  const { update } = useGame();
  const [name, setName] = useState('');
  const check = checkUsername(name);

  const start = () => {
    if (!check.ok) return;
    update((s) => ({ ...s, username: name, joinedAt: Date.now() }));
    router.replace('/map');
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.green }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={{ position: 'absolute', width: 340, height: 340, borderRadius: 170, backgroundColor: '#26875F', top: -80, right: -120 }} />
      <View style={{ position: 'absolute', width: 220, height: 220, borderRadius: 110, backgroundColor: '#26875F', top: 260, left: -110 }} />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingTop: insets.top + 40, paddingBottom: insets.bottom + 24, paddingHorizontal: 24 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ height: 250, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ position: 'absolute', left: 30, top: 20 }}>
            <DogArt look={getBreed('pembroke-welsh-corgi').look} size={100} />
          </View>
          <View style={{ position: 'absolute', right: 30, top: 0 }}>
            <DogArt look={getBreed('dalmatian').look} size={96} />
          </View>
          <View style={{ position: 'absolute', top: 70 }}>
            <DogArt look={getBreed('golden-retriever').look} size={130} />
          </View>
        </View>

        <View style={{ flex: 1, justifyContent: 'flex-end', gap: 16 }}>
          <View>
            <AppText weight="black" size={38} color={colors.white} style={{ lineHeight: 42 }}>
              Every dog{'\n'}you meet,
            </AppText>
            <AppText weight="black" size={38} color={colors.yellow} style={{ lineHeight: 42 }}>
              kept forever.
            </AppText>
          </View>
          <AppText size={16} color="#D7EDE3">
            Spot a real dog, snap it, and it joins your pack. Fill your breed index one walk at a time.
          </AppText>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: colors.white,
              borderRadius: radius.md,
              height: 56,
              paddingHorizontal: 16,
              marginTop: 8,
            }}
          >
            <AppText size={17} color={colors.muted}>
              @
            </AppText>
            <TextInput
              value={name}
              onChangeText={(t) => setName(t.trim().toLowerCase())}
              placeholder="pick a username"
              placeholderTextColor={colors.muted}
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={20}
              returnKeyType="go"
              onSubmitEditing={start}
              accessibilityLabel="Username"
              style={{ flex: 1, minWidth: 0, fontFamily: fonts.semibold, fontSize: 17, color: colors.ink, marginLeft: 4, height: '100%' }}
            />
            {check.label ? (
              <AppText weight="bold" size={12} color={check.ok ? colors.green : colors.red}>
                {check.label}
              </AppText>
            ) : null}
          </View>
          <AppText size={13} color="#BFE0D1" align="center">
            No email, no password. Just pick a username.
          </AppText>
          <Button label="Start collecting" variant="yellow" onPress={start} disabled={!check.ok} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
