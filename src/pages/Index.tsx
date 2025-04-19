
import { Layout } from "@/components/layout/Layout";
import { Routes, Route, Navigate } from "react-router-dom";
import TasksPage from "./TasksPage";
import TreePage from "./TreePage";
import CommunityPage from "./CommunityPage";
import ProjectsPage from "./ProjectsPage";
import { TaskProvider } from "@/context/TaskContext";
import { TreeProvider } from "@/context/TreeContext";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen flex-col gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-alderan-green" />
        <p className="text-muted-foreground">Loading your data...</p>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

const Index = () => {
  return (
    <TreeProvider>
      <TaskProvider>
        <Routes>
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<TasksPage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="tree" element={<TreePage />} />
            <Route path="community" element={<CommunityPage />} />
          </Route>
        </Routes>
      </TaskProvider>
    </TreeProvider>
  );
};

export default Index;
