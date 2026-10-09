import { FlatList, StyleSheet, Text, View } from 'react-native';
import { DogBadge } from '../components/DogBadge';
import { BREEDS, RARITY_LABEL } from '../data/breeds';
import { useCollection } from '../storage/collection';

export function CollectionScreen() {
  const { catches } = useCollection();

  const countByBreed = new Map<string, number>();
  for (const c of catches) countByBreed.set(c.breedId, (countByBreed.get(c.breedId) ?? 0) + 1);
  const latestNameByBreed = new Map<string, string>();
  for (const c of catches) latestNameByBreed.set(c.breedId, c.name);

  const discovered = BREEDS.filter((b) => countByBreed.has(b.id)).length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Dogs</Text>
        <Text style={styles.progress}>
          {discovered} of {BREEDS.length} breeds · {catches.length} caught
        </Text>
      </View>
      <FlatList
        data={BREEDS}
        keyExtractor={(b) => b.id}
        numColumns={3}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => {
          const count = countByBreed.get(item.id) ?? 0;
          const caught = count > 0;
          return (
            <View style={styles.cell}>
              <DogBadge breed={item} size={72} silhouette={!caught} />
              <Text style={styles.breedName} numberOfLines={2}>
                {caught ? item.name : '???'}
              </Text>
              <Text style={styles.meta}>
                {caught ? `${latestNameByBreed.get(item.id)} · ×${count}` : RARITY_LABEL[item.rarity]}
              </Text>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF8F0' },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
  title: { fontSize: 28, fontWeight: '800' },
  progress: { color: '#666', marginTop: 4 },
  grid: { paddingHorizontal: 8, paddingBottom: 24 },
  cell: { flex: 1 / 3, alignItems: 'center', paddingVertical: 12, paddingHorizontal: 4 },
  breedName: { fontSize: 13, fontWeight: '600', textAlign: 'center', marginTop: 6 },
  meta: { fontSize: 11, color: '#888', marginTop: 2 },
});
