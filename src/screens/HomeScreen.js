import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { formatGenres, formatRating, getPopularShows } from "../services/api";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2;

export default function HomeScreen({ navigation }) {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchShows = async () => {
    try {
      setError(null);
      const data = await getPopularShows();
      // Filter show yang memiliki gambar [cite: 6]
      const withImages = data.filter((s) => s.image && s.image.medium);
      setShows(withImages);
    } catch (err) {
      setError("Gagal memuat data. Periksa koneksi internet Anda.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchShows();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchShows();
  }, []);

  const renderShowCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        // DISESUAIKAN: Mengirim objek item utuh dengan kunci 'show'
        // agar terbaca oleh DetailScreen
        navigation.navigate("Detail", { show: item })
      }
      activeOpacity={0.85}
    >
      <Image
        source={{ uri: item.image?.medium }}
        style={styles.cardImage}
        resizeMode="cover"
      />
      <View style={styles.cardOverlay}>
        <View style={styles.ratingBadge}>
          <Text style={styles.ratingText}>⭐ {formatRating(item.rating)}</Text>
        </View>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.cardGenre} numberOfLines={1}>
          {formatGenres(item.genres)}
        </Text>
        <View style={styles.statusRow}>
          <View
            style={[
              styles.statusDot,
              {
                backgroundColor:
                  item.status === "Running" ? "#4ADE80" : "#F87171",
              },
            ]}
          />
          <Text style={styles.statusText}>{item.status || "Unknown"}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <StatusBar barStyle="light-content" backgroundColor="#0D0D1A" />
        <ActivityIndicator size="large" color="#E040FB" />
        <Text style={{ color: "#888", marginTop: 15, fontSize: 14 }}>
          Menyiapkan tontonan seru...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <StatusBar barStyle="light-content" backgroundColor="#0D0D1A" />
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            setLoading(true);
            fetchShows();
          }}
        >
          <Text style={styles.retryText}>Coba Lagi</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0D0D1A" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🎬 MovieDex</Text>
        <Text style={styles.headerSubtitle}>Temukan serial favoritmu</Text>
      </View>
      <FlatList
        data={shows}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderShowCard}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#E040FB"]}
            tintColor="#E040FB"
            title="Memperbarui..."
            titleColor="#888"
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0D1A",
  },
  centered: {
    flex: 1,
    backgroundColor: "#0D0D1A",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#1E1E32",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#888",
    marginTop: 2,
  },
  listContent: {
    padding: 12,
    paddingBottom: 100,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 12,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: "#16162A",
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#2A2A42",
  },
  cardImage: {
    width: "100%",
    height: CARD_WIDTH * 1.4,
    backgroundColor: "#1E1E32",
  },
  cardOverlay: {
    position: "absolute",
    top: 8,
    right: 8,
  },
  ratingBadge: {
    backgroundColor: "rgba(0,0,0,0.75)",
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
  },
  ratingText: {
    color: "#FCD34D",
    fontSize: 11,
    fontWeight: "700",
  },
  cardContent: {
    padding: 10,
  },
  cardTitle: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 18,
    marginBottom: 4,
  },
  cardGenre: {
    color: "#A78BFA",
    fontSize: 11,
    marginBottom: 6,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    color: "#888",
    fontSize: 10,
  },
  loadingText: {
    color: "#888",
    marginTop: 12,
    fontSize: 14,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorText: {
    color: "#F87171",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#E040FB",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
  },
});
