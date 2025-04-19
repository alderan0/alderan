
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import TasksPage from "@/pages/TasksPage";
import TreePage from "@/pages/TreePage";
import ProjectsPage from "@/pages/ProjectsPage";
import CommunityPage from "@/pages/CommunityPage";
import AuthPage from "@/pages/auth/AuthPage";
import LandingPage from "@/pages/LandingPage";
import { Toaster } from "@/components/ui/toaster";
import { TaskProvider } from "@/context/TaskContext";
import { TreeProvider } from "@/context/TreeContext";
import { useEffect } from "react";
import { loadSampleData } from "@/utils/sampleData";

function App() {
  useEffect(() => {
    // Load sample data when the app starts
    loadSampleData();
  }, []);
  
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
                <TreeProvider>
                  <TaskProvider>
                    <Layout />
                  </TaskProvider>
                </TreeProvider>
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/app/tasks" replace />} />
            <Route path="tasks" element={<TasksPage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="tree" element={<TreePage />} />
            <Route path="community" element={<CommunityPage />} />
            <Route path="settings" element={<div className="p-8">
              <h1 className="text-2xl font-bold">Settings</h1>
              <p className="text-muted-foreground mt-2">App settings will appear here.</p>
            </div>} />
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
