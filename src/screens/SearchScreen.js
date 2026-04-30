import { useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  Text, TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { formatGenres, searchShows } from '../services/api';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

export default function SearchScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (text) => {
    setQuery(text);
    setError(null); 

    if (text.length > 2) { 
      setLoading(true);
      try {
        const data = await searchShows(text);
        setResults(data.filter(s => s.image)); 
      } catch (err) {
        setError('Gagal memuat data. Periksa koneksi internet Anda.');
      } finally {
        setLoading(false);
      }
    } else {
      setResults([]);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card} 
      activeOpacity={0.8}
      onPress={() => navigation.navigate("Detail", { show: item })}
    >
      <Image source={{ uri: item.image?.medium }} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.cardGenre}>{formatGenres(item.genres)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0D0D1A" />
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

      {error ? (
        <View style={styles.centered}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton} 
            onPress={() => handleSearch(query)}
          >
            <Text style={styles.retryText}>Coba Lagi</Text>
          </TouchableOpacity>
        </View>
      ) : loading ? (
        <ActivityIndicator size="large" color="#C8A165" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            query.length > 2 ? (
              <Text style={styles.empty}>Tidak ditemukan hasil. Periksa koneksi Anda.</Text>
            ) : null
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D1A' },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
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
  card: { width: CARD_WIDTH, backgroundColor: '#16162A', borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: '#2A2A42' },
  cardImage: { width: '100%', height: 200 },
  cardContent: { padding: 10 },
  cardTitle: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
  cardGenre: { color: '#C8A165', fontSize: 11, marginTop: 4 }, 
  empty: { color: '#888', textAlign: 'center', marginTop: 50 },
  errorIcon: { fontSize: 48, marginBottom: 16 },
  errorText: {
    color: '#F87171',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#C8A165', 
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryText: {
    color: '#0D0D1A',
    fontWeight: '700',
    fontSize: 14,
  },
});