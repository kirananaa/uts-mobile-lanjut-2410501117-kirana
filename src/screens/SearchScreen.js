import React, { useState } from 'react';
import { 
  View, Text, TextInput, FlatList, 
  StyleSheet, ActivityIndicator, TouchableOpacity, Image, Dimensions 
} from 'react-native';
import { searchShows, formatRating, formatGenres } from '../services/api';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

export default function SearchScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (text) => {
    setQuery(text);
    if (text.length > 2) { // Cari kalau user sudah ketik lebih dari 2 huruf
      setLoading(true);
      try {
        const data = await searchShows(text);
        setResults(data.filter(s => s.image)); // Filter yang ada gambarnya saja
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    } else {
      setResults([]);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} activeOpacity={0.8}>
      <Image source={{ uri: item.image?.medium }} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.cardGenre}>{formatGenres(item.genres)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cari Serial</Text>
        <TextInput
          style={styles.searchBar}
          placeholder="Ketik judul film..."
          placeholderTextColor="#888"
          value={query}
          onChangeText={handleSearch}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#E040FB" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            query.length > 2 ? <Text style={styles.empty}>Tidak ditemukan hasil.</Text> : null
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D1A' },
  header: { paddingTop: 60, paddingHorizontal: 16, paddingBottom: 20 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#FFF', marginBottom: 15 },
  searchBar: {
    backgroundColor: '#1E1E32',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    color: '#FFF',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#2A2A42'
  },
  list: { padding: 12 },
  row: { justifyContent: 'space-between', marginBottom: 12 },
  card: { width: CARD_WIDTH, backgroundColor: '#16162A', borderRadius: 12, overflow: 'hidden' },
  cardImage: { width: '100%', height: 200 },
  cardContent: { padding: 10 },
  cardTitle: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
  cardGenre: { color: '#A78BFA', fontSize: 11, marginTop: 4 },
  empty: { color: '#888', textAlign: 'center', marginTop: 50 }
});