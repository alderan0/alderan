
import { Layout } from "@/components/layout/Layout";
import { Routes, Route, Navigate } from "react-router-dom";
import TasksPage from "./TasksPage";
import TreePage from "./TreePage";
import CommunityPage from "./CommunityPage";
import { TaskProvider } from "@/context/TaskContext";
import { TreeProvider } from "@/context/TreeContext";

const Index = () => {
  return (
    <TaskProvider>
      <TreeProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<TasksPage />} />
            <Route path="tree" element={<TreePage />} />
            <Route path="community" element={<CommunityPage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Route>
        </Routes>
      </TreeProvider>
    </TaskProvider>
  );
};

export default Index;
