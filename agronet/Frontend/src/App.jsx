import AppRouter from "./routing/AppRouter";

import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { LocationProvider } from "./context/LocationContext";

function App() {
  return (
    <CartProvider>
      <AuthProvider>
        <LocationProvider>
          <AppRouter />
        </LocationProvider>
      </AuthProvider>
    </CartProvider>
  );
}

export default App;
