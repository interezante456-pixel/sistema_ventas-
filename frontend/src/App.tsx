import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import "./index.css"; // Asegúrate de importar los estilos si no están en main.tsx

function App() {
  return <RouterProvider router={router} />
}

export default App;