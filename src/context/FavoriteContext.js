import { createContext, useContext, useState } from "react";

const FavoriteContext = createContext();

export const FavoriteProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  const toggleFavorite = (show) => {
    const isExist = favorites.find((item) => item.id === show.id);
    if (isExist) {
      setFavorites(favorites.filter((item) => item.id !== show.id));
    } else {
      setFavorites([...favorites, show]);
    }
  };

  const isFavorite = (id) => favorites.some((item) => item.id === id);

  return (
    <FavoriteContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoriteContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoriteContext);
