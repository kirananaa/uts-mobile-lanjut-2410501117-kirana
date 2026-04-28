import {
  Alert,
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAppContext } from "../context/AppContext";

function FavItem({ item, onPress, onHapus }) {
  const poster = item?.image?.medium;
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(item)}
      activeOpacity={0.7}
    >
      {poster ? (
        <Image source={{ uri: poster }} style={styles.poster} />
      ) : (
        <View style={[styles.poster, styles.noPoster]}>
          <Text style={{ fontSize: 24 }}>🎬</Text>
        </View>
      )}

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>
          {item.name}
        </Text>
        {item.genres?.length > 0 && (
          <Text style={styles.genre}>{item.genres[0]}</Text>
        )}
        {item.rating?.average && (
          <Text style={styles.rating}>⭐ {item.rating.average}</Text>
        )}
        {item.status && (
          <Text
            style={
              item.status === "Running" ? styles.statusOn : styles.statusOff
            }
          >
            {item.status}
          </Text>
        )}
      </View>

      <TouchableOpacity style={styles.hapusBtn} onPress={() => onHapus(item)}>
        <Text style={styles.hapusText}>Hapus</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

export default function FavoritesScreen({ navigation }) {
  const { favorites, removeFavorite } = useAppContext();

  function handlePress(show) {
    // Navigasi ke Detail melalui HomeStack agar tidak error
    navigation.navigate("Home", { screen: "Detail", params: { show } });
  }

  function handleHapus(item) {
    Alert.alert("Hapus Favorit", `Hapus "${item.name}" dari daftar favorit?`, [
      { text: "Batal", style: "cancel" },
      {
        text: "Hapus",
        style: "destructive",
        onPress: () => removeFavorite(item.id),
      },
    ]);
  }

  if (favorites.length === 0) {
    return (
      <View style={styles.center}>
        <StatusBar barStyle="light-content" backgroundColor="#0D0D1A" />
        <Text style={styles.emptyIcon}>⭐</Text>
        <Text style={styles.emptyTitle}>Belum ada favorit</Text>
        <Text style={styles.emptyDesc}>
          Buka detail film lalu tekan "Tambah ke Favorit" untuk menyimpan
          koleksimu.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0D0D1A" />
      <FlatList
        data={favorites}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <FavItem item={item} onPress={handlePress} onHapus={handleHapus} />
        )}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListHeaderComponent={
          <Text style={styles.header}>
            ⭐ Favorit Saya ({favorites.length})
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0D0D1A" }, // Latar Gelap
  list: { padding: 16, paddingTop: 60 },
  header: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 20,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#16162A", // Kartu Gelap
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#2A2A42",
    alignItems: "center",
  },
  poster: {
    width: 80,
    height: 110,
    resizeMode: "cover",
    backgroundColor: "#1E1E32",
  },
  noPoster: { alignItems: "center", justifyContent: "center" },
  info: { flex: 1, padding: 12, gap: 4 },
  name: { fontSize: 15, fontWeight: "700", color: "#FFFFFF" },
  genre: { fontSize: 12, color: "#A78BFA" }, // Warna Ungu Muda
  rating: { fontSize: 12, color: "#FCD34D", fontWeight: "700" },
  statusOn: { fontSize: 11, fontWeight: "600", color: "#4ADE80" },
  statusOff: { fontSize: 11, fontWeight: "600", color: "#F87171" },
  hapusBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 12,
    backgroundColor: "rgba(220, 38, 38, 0.1)", // Transparan merah
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#DC2626",
  },
  hapusText: { color: "#DC2626", fontSize: 12, fontWeight: "700" },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    backgroundColor: "#0D0D1A",
  },
  emptyIcon: { fontSize: 60, marginBottom: 16 },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  emptyDesc: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    lineHeight: 22,
  },
});
