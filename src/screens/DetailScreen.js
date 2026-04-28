import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useAppContext } from "../context/AppContext"; // Pastikan path-nya benar
import { fetchShowDetail, stripHtml } from "../services/api";

const { width } = Dimensions.get("window");

function InfoRow({ label, value }) {
  if (!value) return null;
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

export default function DetailScreen({ route }) {
  const showParam = route?.params?.show;
  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Mengambil fungsi favorit dari AppContext
  const { isFavorite, addFavorite, removeFavorite } = useAppContext();

  // Gunakan show dari API jika ada, jika tidak pakai showParam dari navigasi
  const currentShow = show || showParam;
  const sudahFavorit = currentShow ? isFavorite(currentShow.id) : false;

  useEffect(() => {
    if (showParam?.id) loadDetail();
  }, [showParam?.id]);

  async function loadDetail() {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchShowDetail(showParam.id);
      setShow(data);
    } catch (e) {
      setError("Gagal memuat detail film.");
    } finally {
      setLoading(false);
    }
  }

  const handleToggleFavorite = () => {
    if (sudahFavorit) {
      removeFavorite(currentShow.id);
      Alert.alert(
        "Dihapus",
        `"${currentShow.name}" telah dihapus dari favorit.`,
      );
    } else {
      addFavorite(currentShow);
      Alert.alert("Berhasil", `"${currentShow.name}" ditambahkan ke favorit!`);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#E040FB" />
      </View>
    );
  }

  if (!showParam) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: "#FFF" }}>Data tidak tersedia</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      <Image
        source={{
          uri: currentShow.image?.original || currentShow.image?.medium,
        }}
        style={styles.poster}
      />

      <View style={styles.body}>
        <View style={styles.titleRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{currentShow.name}</Text>
            <Text style={styles.rating}>
              {currentShow.rating?.average
                ? `⭐ ${currentShow.rating.average}`
                : "⭐ N/A"}
            </Text>
          </View>

          {/* Tombol Favorit */}
          <TouchableOpacity
            style={[styles.favBtn, sudahFavorit && styles.favBtnActive]}
            onPress={handleToggleFavorite}
          >
            <Text
              style={[styles.favBtnText, sudahFavorit && { color: "#DC2626" }]}
            >
              {sudahFavorit ? "❤️" : "🤍"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.genreRow}>
          {currentShow.genres?.map((genre, index) => (
            <View key={index} style={styles.chip}>
              <Text style={styles.chipText}>{genre}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Tentang Film</Text>
        <View style={styles.infoCard}>
          <InfoRow label="Status" value={currentShow.status} />
          <InfoRow label="Bahasa" value={currentShow.language} />
          <InfoRow label="Tipe" value={currentShow.type} />
          <InfoRow
            label="Jaringan"
            value={currentShow.network?.name || currentShow.webChannel?.name}
          />
        </View>

        {currentShow.summary && (
          <>
            <Text style={styles.sectionTitle}>Sinopsis</Text>
            <Text style={styles.summary}>{stripHtml(currentShow.summary)}</Text>
          </>
        )}

        <View style={{ height: 40 }} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0D0D1A" },
  centered: {
    flex: 1,
    backgroundColor: "#0D0D1A",
    justifyContent: "center",
    alignItems: "center",
  },
  poster: { width: width, height: 480, resizeMode: "cover" },
  body: {
    padding: 20,
    marginTop: -40,
    backgroundColor: "#0D0D1A",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  titleRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  title: { fontSize: 26, fontWeight: "800", color: "#FFFFFF", marginBottom: 4 },
  rating: { fontSize: 16, color: "#FCD34D", fontWeight: "700" },
  favBtn: {
    backgroundColor: "#1E1E32",
    padding: 12,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#2A2A42",
  },
  favBtnActive: {
    borderColor: "#DC2626",
    backgroundColor: "rgba(220, 38, 38, 0.1)",
  },
  favBtnText: { fontSize: 20 },
  genreRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
    marginTop: 10,
  },
  chip: {
    backgroundColor: "#1E1E32",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#E040FB",
  },
  chipText: { color: "#E040FB", fontSize: 12, fontWeight: "600" },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 10,
    marginTop: 15,
  },
  infoCard: {
    backgroundColor: "#16162A",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2A2A42",
    overflow: "hidden",
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A42",
  },
  infoLabel: { color: "#888", fontSize: 14 },
  infoValue: { color: "#FFF", fontSize: 14, fontWeight: "600" },
  summary: {
    color: "#CCC",
    fontSize: 15,
    lineHeight: 24,
    textAlign: "justify",
  },
});
