
import { Layout } from "@/components/layout/Layout";
import { Routes, Route, Navigate } from "react-router-dom";
import TasksPage from "./TasksPage";
import TreePage from "./TreePage";
import CommunityPage from "./CommunityPage";
import { TaskProvider } from "@/context/TaskContext";
import { TreeProvider } from "@/context/TreeContext";
import { AuthProvider } from "@/context/AuthContext";
import { useAuth } from "@/context/AuthContext";

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

const Index = () => {
  return (
    <AuthProvider>
      <TaskProvider>
        <TreeProvider>
          <Routes>
            <Route path="/" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<TasksPage />} />
              <Route path="tree" element={<TreePage />} />
              <Route path="community" element={<CommunityPage />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Route>
          </Routes>
        </TreeProvider>
      </TaskProvider>
    </AuthProvider>
  );
};

export default Index;
