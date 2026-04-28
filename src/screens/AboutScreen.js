import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Image, 
  Linking,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

// DATA DEVELOPER
const DEVELOPER = {
  name: "Kirana",
  nim: "2410501117",
  class: "Kelas A",
  theme: "Tema B - MovieDex",
  avatarUri: require("../../assets/images/profil.jpg"),
};

const TECH_STACK = [
  { label: "React Native", icon: "logo-react", color: "#61DAFB" },
  { label: "Expo", icon: "cube", color: "#A78BFA" },
  { label: "TVMaze API", icon: "film", color: "#E040FB" },
  { label: "React Navigation", icon: "navigate", color: "#4ADE80" },
];

const LINKS = [
  {
    label: "Source Code",
    icon: "logo-github",
    url: "https://github.com/",
    color: "#FFFFFF",
  },
  {
    label: "TVMaze API",
    icon: "globe",
    url: "https://www.tvmaze.com/api",
    color: "#E040FB",
  },
  {
    label: "Laporkan Bug",
    icon: "bug",
    url: "mailto:hello@moviedex.app",
    color: "#F87171",
  },
];

export default function AboutScreen() {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Membuat array animasi secara dinamis (total 6 section/elemen)
  const fadeAnims = useRef([...Array(6)].map(() => new Animated.Value(0))).current;
  const slideAnims = useRef([...Array(6)].map(() => new Animated.Value(24))).current;

  useEffect(() => {
    // Animasi Logo berdenyut
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.08, duration: 1800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1800, useNativeDriver: true }),
      ])
    ).start();

    // Animasi muncul berurutan (Stagger)
    Animated.stagger(
      100,
      fadeAnims.map((fade, i) =>
        Animated.parallel([
          Animated.timing(fade, { toValue: 1, duration: 450, useNativeDriver: true }),
          Animated.timing(slideAnims[i], { toValue: 0, duration: 450, useNativeDriver: true }),
        ])
      )
    ).start();
  }, []);

  const animStyle = (i) => ({
    opacity: fadeAnims[i],
    transform: [{ translateY: slideAnims[i] }],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0D0D1A" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* ── Hero ── */}
        <View style={styles.hero}>
          <View style={styles.ringOuter} />
          <View style={styles.ringMiddle} />
          <Animated.View style={[styles.logoWrapper, { transform: [{ scale: pulseAnim }] }]}>
            <Text style={styles.logoEmoji}>🎬</Text>
          </Animated.View>
          <Animated.View style={animStyle(0)}>
            <Text style={styles.appName}>MovieDex</Text>
            <Text style={styles.tagline}>Your universe of great stories</Text>
            <View style={styles.versionPill}>
              <Text style={styles.versionText}>v1.0.0</Text>
            </View>
          </Animated.View>
        </View>

        {/* ── Profil Pengembang (Ganti Ikon dengan Gambar) ── */}
        <Animated.View style={[styles.section, animStyle(1)]}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionDot, { backgroundColor: "#4ADE80" }]} />
            <Text style={styles.sectionTitle}>Profil Pengembang</Text>
          </View>
          <View style={styles.memberRow}>
            <View style={styles.imageGlowContainer}> 
              <Image 
                source={DEVELOPER.avatarUri} 
                style={styles.developerImage} 
              />
            </View>
            <View style={styles.memberTextContainer}>
              <Text style={styles.memberName}>{DEVELOPER.name}</Text>
              <Text style={styles.memberInfo}>{DEVELOPER.nim} • {DEVELOPER.class}</Text>
              <Text style={styles.memberRole}>{DEVELOPER.theme} • {DEVELOPER.role}</Text>
            </View>
          </View>
        </Animated.View>

        {/* ── Tentang Aplikasi ── */}
        <Animated.View style={[styles.section, animStyle(2)]}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionDot, { backgroundColor: "#E040FB" }]} />
            <Text style={styles.sectionTitle}>Tentang Aplikasi</Text>
          </View>
          <Text style={styles.bodyText}>
            MovieDex adalah katalog serial TV modern yang dirancang untuk memudahkan eksplorasi tontonan 
            favorit Anda. Didukung oleh data real-time, kami menyajikan antarmuka yang bersih dan interaktif 
            untuk pengalaman pencarian yang unggul.
          </Text>
        </Animated.View>

        {/* ── Teknologi ── */}
        <Animated.View style={[styles.section, animStyle(3)]}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionDot, { backgroundColor: "#61DAFB" }]} />
            <Text style={styles.sectionTitle}>Teknologi</Text>
          </View>
          <View style={styles.techGrid}>
            {TECH_STACK.map((tech) => (
              <View key={tech.label} style={styles.techChip}>
                <Ionicons name={tech.icon} size={16} color={tech.color} />
                <Text style={[styles.techLabel, { color: tech.color }]}>{tech.label}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* ── Tautan ── */}
        <Animated.View style={[styles.section, animStyle(4)]}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionDot, { backgroundColor: "#FCD34D" }]} />
            <Text style={styles.sectionTitle}>Tautan</Text>
          </View>
          {LINKS.map((link, index) => (
            <TouchableOpacity 
              key={link.label} 
              style={[styles.linkRow, index === LINKS.length - 1 && { borderBottomWidth: 0 }]} 
              onPress={() => Linking.openURL(link.url)} 
              activeOpacity={0.75}
            >
              <View style={[styles.linkIcon, { borderColor: link.color + "33" }]}>
                <Ionicons name={link.icon} size={18} color={link.color} />
              </View>
              <Text style={styles.linkLabel}>{link.label}</Text>
              <Ionicons name="chevron-forward" size={16} color="#444" style={{ marginLeft: "auto" }} />
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* ── Footer ── */}
        <Animated.View style={animStyle(5)}>
          <Text style={styles.footer}>
            Dibuat dengan ❤️ di Indonesia{"\n"}© 2026 Kirana - {DEVELOPER.nim}
          </Text>
        </Animated.View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0D0D1A" },
  scrollContent: { paddingBottom: 48 },
  hero: { alignItems: "center", paddingTop: 60, paddingBottom: 30, overflow: "hidden", position: "relative" },
  ringOuter: { position: "absolute", width: 240, height: 240, borderRadius: 120, borderWidth: 1, borderColor: "#E040FB18", top: 10, alignSelf: "center" },
  ringMiddle: { position: "absolute", width: 160, height: 160, borderRadius: 80, borderWidth: 1, borderColor: "#E040FB28", top: 50, alignSelf: "center" },
  logoWrapper: { width: 90, height: 90, borderRadius: 24, backgroundColor: "#16162A", borderWidth: 1.5, borderColor: "#E040FB55", justifyContent: "center", alignItems: "center", marginBottom: 20, elevation: 12 },
  logoEmoji: { fontSize: 42 },
  appName: { fontSize: 34, fontWeight: "800", color: "#FFFFFF", letterSpacing: 0.5, textAlign: "center" },
  tagline: { fontSize: 13, color: "#888", marginTop: 4, textAlign: "center" },
  versionPill: { alignSelf: "center", marginTop: 12, backgroundColor: "#1E1E32", borderWidth: 1, borderColor: "#2A2A42", paddingHorizontal: 14, paddingVertical: 4, borderRadius: 20 },
  versionText: { color: "#A78BFA", fontSize: 11, fontWeight: "700" },
  section: { marginHorizontal: 16, marginBottom: 14, backgroundColor: "#16162A", borderRadius: 16, borderWidth: 1, borderColor: "#2A2A42", padding: 18 },
  sectionHeader: { flexDirection: "row", alignItems: "center", marginBottom: 14, gap: 8 },
  sectionDot: { width: 8, height: 8, borderRadius: 4 },
  sectionTitle: { color: "#FFFFFF", fontSize: 15, fontWeight: "700" },
  bodyText: { color: "#AAAACC", fontSize: 13, lineHeight: 20 },
  techGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  techChip: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#0D0D1A", borderWidth: 1, borderColor: "#2A2A42", paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20 },
  techLabel: { fontSize: 12, fontWeight: "600" },
  
  memberRow: { flexDirection: "row", alignItems: "center", gap: 16 },
  memberTextContainer: { flex: 1 }, 
  imageGlowContainer: { 
    borderRadius: 18,
    shadowColor: "#E040FB",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },
  developerImage: {
    width: 65, 
    height: 65, 
    borderRadius: 18, 
    borderWidth: 1.5, 
    borderColor: "#E040FB55",
  },
  // -- Akhir Style Baru --

  memberName: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
  memberInfo: { color: "#A78BFA", fontSize: 12, marginTop: 2 },
  memberRole: { color: "#888", fontSize: 12, marginTop: 2 },
  linkRow: { flexDirection: "row", alignItems: "center", gap: 14, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: "#1E1E32" },
  linkIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: "#0D0D1A", borderWidth: 1, justifyContent: "center", alignItems: "center" },
  linkLabel: { color: "#DDDDEE", fontSize: 13, fontWeight: "600" },
  footer: { color: "#444", fontSize: 11, textAlign: "center", lineHeight: 18, marginTop: 10 },
});