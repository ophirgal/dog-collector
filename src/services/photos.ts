import { Directory, File, Paths } from 'expo-file-system';
import { Platform } from 'react-native';

/**
 * Camera photos land in the cache directory, which the OS may clear. Copy them
 * into the app's documents so your pack keeps its pictures.
 */
export async function keepPhoto(uri: string, id: string): Promise<string> {
  if (Platform.OS === 'web') return uri;
  const dir = new Directory(Paths.document, 'dogs');
  if (!dir.exists) dir.create({ intermediates: true, idempotent: true });
  const dest = new File(dir, `${id}.jpg`);
  await new File(uri).copy(dest);
  return dest.uri;
}

export function deletePhoto(uri?: string) {
  if (!uri || Platform.OS === 'web' || !uri.startsWith('file:')) return;
  try {
    const f = new File(uri);
    if (f.exists) f.delete();
  } catch {
    // Already gone.
  }
}
