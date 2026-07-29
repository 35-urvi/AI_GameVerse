import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import MainLayout from "./components/layout/MainLayout";

import Dashboard from "./pages/Dashboard/Dashboard";
import Games from "./pages/Games/Games";
import Leaderboard from "./pages/Leaderboard/Leaderboard";
import Statistics from "./pages/Statistics/Statistics";
import SavedGames from "./pages/SavedGames/SavedGames";
import Settings from "./pages/Settings/Settings";
import TicTacToe from "@/pages/Games/TicTacToe/TicTacToe";
import ConnectFourPage from "@/pages/Games/ConnectFour/ConnectFourPage";
import EightPuzzle from "@/pages/Games/EightPuzzle/EightPuzzle";
import WaterJug from "@/pages/Games/WaterJug/WaterJug";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route
            path="/"
            element={<Navigate to="/dashboard" replace />}
          />

          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/games" element={<Games />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/saved-games" element={<SavedGames />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/games/tic-tac-toe" element={<TicTacToe />}/>
          <Route path="/games/connect-four" element={<ConnectFourPage />}/>
          <Route path="/games/8-puzzle" element={<EightPuzzle />}/>
          <Route path="/games/water-jug" element={<WaterJug />}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;