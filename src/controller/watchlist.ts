// Einen Film in die watchlist hinzufügen
export const addToWatchlist = async (userId: string, movieId: string) => {
  try {
    const response = await fetch("/api/watchlist/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, movieId }),
    });
    const data = await response.json();
    console.log(data.message); // Affiche le message de succès
    return data.message;
  } catch (error) {
    console.error("Error adding film to watchlist:", error);
    return error;
  }
};

// Einen Film aus der watchlist entfernen
export const removeFromWatchlist = async (userId: string, movieId: string) => {
  try {
    const response = await fetch("/api/watchlist/remove", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, movieId }),
    });
    const data = await response.json();
    console.log(data.message); // Affiche le message de succès
    return data.message;
  } catch (error) {
    console.error("Error removing film from watchlist:", error);
    return error;
  }
};

// Alle Filmen der watchlist zeigen
export const getWatchlist = async (userId: string) => {
  try {
    const response = await fetch(`/api/watchlist?userId=${userId}`);
    const data = await response.json();
    return data.watchlist;
  } catch (error) {
    console.error("Error fetching watchlist:", error);
    return [];
  }
};
