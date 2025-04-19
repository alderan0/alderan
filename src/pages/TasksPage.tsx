
import { SuggestedTasks } from "@/components/tasks/SuggestedTasks";
import { TaskList } from "@/components/tasks/TaskList";
import { AddTaskForm } from "@/components/tasks/AddTaskForm";

const TasksPage = () => {
  return (
    <div className="pb-20">
      <SuggestedTasks />
      <TaskList />
      <AddTaskForm />
    </div>
  );
};

export default TasksPage;
