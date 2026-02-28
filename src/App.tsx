import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import LandingPage from "./pages/LandingPage";
import RegisterPage from "./pages/RegisterPage";
import AdminDashboard from "./pages/AdminDashboard";
import { db } from "./lib/firebase";

function App() {
  if (!db) {
    throw new Error("Firebase initialization failed. This is likely due to missing VITE_FIREBASE_* environment variables in your Vercel Project Settings.");
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>
        <Route path="admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
