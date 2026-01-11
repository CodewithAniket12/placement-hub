import { Task, useUpdateTask, useDeleteTask } from "@/hooks/useTasks";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format, isPast, isToday } from "date-fns";
import { Trash2, CheckCircle2, Clock, AlertCircle, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const dueDate = new Date(task.due_date);
  const isOverdue = isPast(dueDate) && task.status !== "completed";
  const isDueToday = isToday(dueDate);

  const handleStatusChange = async (newStatus: "pending" | "in_progress" | "completed") => {
    try {
      await updateTask.mutateAsync({ id: task.id, status: newStatus });
      toast.success(`Task marked as ${newStatus.replace("_", " ")}`);
    } catch (error) {
      toast.error("Failed to update task");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTask.mutateAsync(task.id);
      toast.success("Task deleted");
    } catch (error) {
      toast.error("Failed to delete task");
    }
  };

  const priorityColors = {
    low: "bg-blue-500/10 text-blue-500",
    medium: "bg-yellow-500/10 text-yellow-500",
    high: "bg-red-500/10 text-red-500",
  };

  const statusColors = {
    pending: "bg-muted text-muted-foreground",
    in_progress: "bg-primary/10 text-primary",
    completed: "bg-green-500/10 text-green-500",
  };

  return (
    <Card className={cn(
      "p-4 transition-all",
      task.status === "completed" && "opacity-60"
    )}>
      <div className="flex items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className={cn(
              "font-medium",
              task.status === "completed" && "line-through text-muted-foreground"
            )}>
              {task.title}
            </h3>
            <Badge className={priorityColors[task.priority]}>
              {task.priority}
            </Badge>
            <Badge className={statusColors[task.status]}>
              {task.status.replace("_", " ")}
            </Badge>
          </div>

          {task.description && (
            <p className="text-sm text-muted-foreground mb-2">
              {task.description}
            </p>
          )}

          <div className="flex items-center gap-4 text-sm">
            <div className={cn(
              "flex items-center gap-1",
              isOverdue ? "text-destructive" : isDueToday ? "text-yellow-500" : "text-muted-foreground"
            )}>
              {isOverdue ? (
                <AlertCircle className="h-4 w-4" />
              ) : (
                <Clock className="h-4 w-4" />
              )}
              <span>
                {isOverdue ? "Overdue: " : isDueToday ? "Due today: " : "Due: "}
                {format(dueDate, "MMM d, yyyy")}
              </span>
            </div>

            {task.company && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <Building2 className="h-4 w-4" />
                <span>{task.company.name}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          {task.status !== "completed" && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleStatusChange("completed")}
              className="h-8 w-8 text-green-500 hover:text-green-600 hover:bg-green-500/10"
            >
              <CheckCircle2 className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
