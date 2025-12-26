import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./AppRoute";
import { SpeedInsights } from "@vercel/speed-insights/next"


function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
      <SpeedInsights />
    </BrowserRouter>
  );
}

export default App;
