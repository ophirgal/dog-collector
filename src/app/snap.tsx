import { CameraView, useCameraPermissions, type CameraType } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { Linking, Platform, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/AppText';
import { DogBubble } from '@/components/DogPicture';
import { DogArt } from '@/components/DogArt';
import { Icon } from '@/components/Icon';
import { Button, IconButton } from '@/components/ui';
import { getBreed } from '@/data/breeds';
import { useGame } from '@/state/store';
import { colors } from '@/theme';

export default function Snap() {
  const insets = useSafeAreaInsets();
  const { state } = useGame();
  const [permission, requestPermission] = useCameraPermissions();
  const camera = useRef<CameraView>(null);
  const [facing, setFacing] = useState<CameraType>('back');
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [tip, setTip] = useState(true);
  const last = state.dogs.find((d) => d.source === 'caught');

  if (!permission) return <View style={{ flex: 1, backgroundColor: colors.night }} />;

  if (!permission.granted) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.green, padding: 24, paddingTop: insets.top + 12, paddingBottom: insets.bottom + 24 }}>
        <IconButton name="close" label="Close" dark onPress={() => router.back()} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16 }}>
          <DogArt look={getBreed('beagle').look} size={120} />
          <AppText weight="black" size={26} color={colors.white} align="center">
            Snap the dogs you meet
          </AppText>
          <AppText size={16} color="#D7EDE3" align="center">
            Dog Collector needs the camera to add a dog to your pack. Photos stay on your phone unless you post them.
          </AppText>
        </View>
        <Button
          label={permission.canAskAgain ? 'Allow camera' : 'Open Settings'}
          variant="yellow"
          onPress={() => (permission.canAskAgain ? requestPermission() : Linking.openSettings())}
        />
      </View>
    );
  }

  const shoot = async () => {
    if (!camera.current || busy) return;
    setBusy(true);
    try {
      if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      const photo = await camera.current.takePictureAsync({ quality: 0.7 });
      if (photo?.uri) router.replace({ pathname: '/caught', params: { photo: photo.uri } });
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <CameraView ref={camera} style={{ flex: 1 }} facing={facing} onCameraReady={() => setReady(true)} />

      <View style={{ position: 'absolute', top: insets.top + 8, left: 16, right: 16, gap: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <IconButton name="close" label="Close camera" dark onPress={() => router.back()} />
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(0,0,0,0.45)', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 7 }}>
            <Icon name="lock" size={14} color={colors.yellow} />
            <AppText weight="semibold" size={12} color={colors.white}>
              Photos stay on your phone
            </AppText>
          </View>
        </View>
        {tip && (
          <Pressable
            onPress={() => setTip(false)}
            accessibilityHint="Dismiss tip"
            style={{ flexDirection: 'row', gap: 10, backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 16, padding: 12, alignItems: 'center' }}
          >
            <View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: colors.yellowSoft, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="paw" size={16} color={colors.yellow} />
            </View>
            <View style={{ flex: 1 }}>
              <AppText weight="bold" size={14}>
                Dog with an owner?
              </AppText>
              <AppText size={13} color={colors.inkSoft}>
                A quick “Can I snap your dog?” goes a long way.
              </AppText>
            </View>
            <Icon name="close" size={16} color={colors.muted} />
          </Pressable>
        )}
      </View>

      <View pointerEvents="none" style={{ position: 'absolute', top: '32%', left: '14%', right: '14%', aspectRatio: 0.85, borderWidth: 3, borderColor: colors.yellow, borderRadius: 28 }}>
        <View style={{ position: 'absolute', top: -14, left: 14, backgroundColor: colors.yellow, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 }}>
          <AppText weight="bold" size={12}>
            Fit the whole dog in the frame
          </AppText>
        </View>
      </View>

      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          paddingBottom: insets.bottom + 24,
          paddingTop: 16,
          paddingHorizontal: 28,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Last catch"
          disabled={!last}
          onPress={() => last && router.push(`/dog/${last.id}`)}
          style={{ width: 52, height: 52 }}
        >
          {last && <DogBubble breedId={last.breedId} photoUri={last.photoUri} size={52} ring={colors.white} />}
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Take photo"
          disabled={!ready || busy}
          onPress={shoot}
          style={({ pressed }) => ({
            width: 84,
            height: 84,
            borderRadius: 42,
            borderWidth: 5,
            borderColor: colors.white,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: ready ? 1 : 0.5,
            transform: [{ scale: pressed ? 0.94 : 1 }],
          })}
        >
          <View style={{ width: 66, height: 66, borderRadius: 33, backgroundColor: colors.yellow }} />
        </Pressable>
        <IconButton name="flip" label="Flip camera" dark size={52} onPress={() => setFacing((f) => (f === 'back' ? 'front' : 'back'))} />
      </View>
    </View>
  );
}
