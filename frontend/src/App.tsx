import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import MainLayout from "./components/layout/MainLayout";

import Games from "./pages/Games/Games";
import GamePlaceholder from "./pages/Games/GamePlaceholder";
import TicTacToe from "@/pages/Games/TicTacToe/TicTacToe";
import ConnectFourPage from "@/pages/Games/ConnectFour/ConnectFourPage";
import EightPuzzle from "@/pages/Games/EightPuzzle/EightPuzzle";
import WaterJug from "@/pages/Games/WaterJug/WaterJug";
import WumpusWorld from "@/pages/Games/WumpusWorld/WumpusWorld";
import BlockWorld from "@/pages/Games/BlockWorld/BlockWorld";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/games" replace />} />
          <Route path="/dashboard" element={<Navigate to="/games" replace />} />

          <Route path="/games" element={<Games />} />
          <Route path="/games/tic-tac-toe" element={<TicTacToe />} />
          <Route path="/games/connect-four" element={<ConnectFourPage />} />
          <Route path="/games/8-puzzle" element={<EightPuzzle />} />
          <Route path="/games/water-jug" element={<WaterJug />} />
          <Route path="/games/wumpus-world" element={<WumpusWorld />} />
          <Route path="/games/block-world" element={<BlockWorld />} />

          {/* Catch-all game route for any game card */}
          <Route path="/games/:gameId" element={<GamePlaceholder />} />
          <Route path="*" element={<Navigate to="/games" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;