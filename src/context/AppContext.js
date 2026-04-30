import { createContext, useContext, useReducer } from "react";

const initialState = {
  favorites: [],
};

export const AppContext = createContext();

const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_FAVORITE":

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

  const addFavorite = (show) =>
    dispatch({ type: "ADD_FAVORITE", payload: show });
  const removeFavorite = (id) =>
    dispatch({ type: "REMOVE_FAVORITE", payload: id });
  const isFavorite = (id) => state.favorites.some((item) => item.id === id);

  return (
    <AppContext.Provider
      value={{
        favorites: state.favorites, 
        addFavorite,
        removeFavorite,
        isFavorite,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
