import * as Sharing from 'expo-sharing';
import { Platform, Share } from 'react-native';

import { getBreed } from '@/data/breeds';
import type { Dog } from '@/state/types';

/** Shares the dog's photo when there is one, otherwise a short message. */
export async function shareDog(dog: Dog) {
  const text = `Meet ${dog.name}, a ${getBreed(dog.breedId).name} in my Dog Collector pack.`;
  try {
    if (dog.photoUri && Platform.OS !== 'web' && (await Sharing.isAvailableAsync())) {
      await Sharing.shareAsync(dog.photoUri, { dialogTitle: text, mimeType: 'image/jpeg', UTI: 'public.jpeg' });
      return;
    }
    await Share.share({ message: text });
  } catch {
    // User dismissed the sheet or sharing isn't available.
  }
}
