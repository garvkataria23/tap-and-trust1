import { BrowserRouter as Router, Routes, Route } from "react-router";
import { AuthProvider } from "@/react-app/contexts/AuthContext";
import { ThemeProvider } from "@/react-app/contexts/ThemeContext";
import { useScreenshotProtection } from "@/react-app/hooks/useScreenshotProtection";
import HomePage from "@/react-app/pages/Home";
import AuthCallbackPage from "@/react-app/pages/AuthCallback";
import LoginPage from "@/react-app/pages/Login";
import DashboardPage from "@/react-app/pages/Dashboard";
import ProfilePage from "@/react-app/pages/Profile";
import FriendsPage from "@/react-app/pages/Friends";
import ChatPage from "@/react-app/pages/Chat";
import ScannerPage from "@/react-app/pages/Scanner";
import DiscoverPage from "@/react-app/pages/Discover";
import GamesPage from "@/react-app/pages/Games";
import MultiplayerGamesPage from "@/react-app/pages/MultiplayerGames";
import FriendRequestsPage from "@/react-app/pages/FriendRequests";
import LeaderboardPage from "@/react-app/pages/Leaderboard";
import MusicPage from "@/react-app/pages/Music";

export default function App() {
  useScreenshotProtection();

  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<LoginPage />} />
            <Route path="/auth/callback" element={<AuthCallbackPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/:userId" element={<ProfilePage />} />
            <Route path="/friends" element={<FriendsPage />} />
            <Route path="/friend-requests" element={<FriendRequestsPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/chat/:friendId" element={<ChatPage />} />
            <Route path="/scanner" element={<ScannerPage />} />
            <Route path="/discover" element={<DiscoverPage />} />
            <Route path="/games" element={<GamesPage />} />
            <Route path="/games/:friendId" element={<GamesPage />} />
            <Route path="/game-stats" element={<MultiplayerGamesPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/music" element={<MusicPage />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
