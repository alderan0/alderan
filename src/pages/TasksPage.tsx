
import { SuggestedTasks } from "@/components/tasks/SuggestedTasks";
import { TaskList } from "@/components/tasks/TaskList";
import { AddTaskForm } from "@/components/tasks/AddTaskForm";
import { MoodSelector } from "@/components/tasks/MoodSelector";
import { HabitTracker } from "@/components/tasks/HabitTracker";

const TasksPage = () => {
  return (
    <div className="pb-20">
      <MoodSelector />
      <SuggestedTasks />
      <HabitTracker />
      <TaskList />
      <AddTaskForm />
    </div>
  );
};

export default TasksPage;
