import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppProvider } from "./src/context/AppContext"; // Import Provider-nya
import AppNavigator from "./src/navigation/AppNavigator";

// Import ini sangat penting jika kamu menggunakan Stack Navigator
import "react-native-gesture-handler";

export default function App() {
  return (
    <SafeAreaProvider>
      {/* Bungkus AppNavigator dengan AppProvider agar 
        halaman Home, Detail, Search, dan Favorit 
        bisa berbagi data film favorit.
      */}
      <AppProvider>
        <AppNavigator />
      </AppProvider>
    </SafeAreaProvider>
  );
}
