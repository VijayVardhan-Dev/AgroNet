import AppRouter from "./routing/AppRouter";

import { CartProvider } from "./context/CartContext";
import { LocationProvider } from "./context/LocationContext";
import { NotificationProvider } from "./context/NotificationContext";
import { WishlistProvider } from "./context/WishlistContext";

function App() {
  return (
    <NotificationProvider>
      <WishlistProvider>
        <CartProvider>
          <LocationProvider>
            <AppRouter />
          </LocationProvider>
        </CartProvider>
      </WishlistProvider>
    </NotificationProvider>
  );
}

export default App;
