import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import TasksPage from "@/pages/TasksPage";
import ProjectsPage from "@/pages/ProjectsPage";
import CommunityPage from "@/pages/CommunityPage";
import AuthPage from "@/pages/auth/AuthPage";
import LandingPage from "@/pages/LandingPage";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />

          {/* Protected routes */}
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/app/tasks" replace />} />
            <Route path="tasks" element={<TasksPage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="community" element={<CommunityPage />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </Router>
  );
}

export default App;
