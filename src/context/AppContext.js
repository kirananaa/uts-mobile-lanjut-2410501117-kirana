import { createContext, useContext, useReducer } from "react";

const initialState = {
  favorites: [],
};

export const AppContext = createContext();

const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_FAVORITE":
      // Cek agar tidak double
      if (state.favorites.some((f) => f.id === action.payload.id)) return state;
      return {
        ...state,
        favorites: [...state.favorites, action.payload],
      };

    case "REMOVE_FAVORITE":
      return {
        ...state,
        favorites: state.favorites.filter((item) => item.id !== action.payload),
      };

    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Helper functions agar kodingan di screen tetap simpel
  const addFavorite = (show) =>
    dispatch({ type: "ADD_FAVORITE", payload: show });
  const removeFavorite = (id) =>
    dispatch({ type: "REMOVE_FAVORITE", payload: id });
  const isFavorite = (id) => state.favorites.some((item) => item.id === id);

  return (
    <AppContext.Provider
      value={{
        favorites: state.favorites, // Kirim favorites-nya saja biar langsung dipakai
        addFavorite,
        removeFavorite,
        isFavorite,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// WAJIB: Tambahkan hook ini agar error 'undefined' hilang
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
