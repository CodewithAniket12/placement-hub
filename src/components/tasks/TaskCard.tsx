import { Task, useUpdateTask, useDeleteTask } from "@/hooks/useTasks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Calendar, Building2, MoreVertical, Trash2, Clock } from "lucide-react";
import { format, isPast, isToday } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  
  const dueDate = new Date(task.due_date);
  const isOverdue = isPast(dueDate) && task.status !== "completed";
  const isDueToday = isToday(dueDate);

  const handleStatusToggle = async () => {
    const newStatus = task.status === "completed" ? "pending" : "completed";
    try {
      await updateTask.mutateAsync({ id: task.id, status: newStatus });
      toast.success(newStatus === "completed" ? "Task completed!" : "Task reopened");
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
    low: "bg-muted text-muted-foreground",
    medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    high: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  };

  return (
    <Card className={cn(
      "transition-all hover:shadow-md",
      task.status === "completed" && "opacity-60"
    )}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={task.status === "completed"}
            onCheckedChange={handleStatusToggle}
            className="mt-1"
          />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className={cn(
                "font-medium text-foreground",
                task.status === "completed" && "line-through text-muted-foreground"
              )}>
                {task.title}
              </h3>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            {task.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {task.description}
              </p>
            )}
            
            <div className="flex flex-wrap items-center gap-2 mt-3">
              {task.company && (
                <Badge variant="outline" className="text-xs">
                  <Building2 className="h-3 w-3 mr-1" />
                  {task.company.name}
                </Badge>
              )}
              
              <Badge className={priorityColors[task.priority]}>
                {task.priority}
              </Badge>
              
              <Badge 
                variant="outline" 
                className={cn(
                  "text-xs",
                  isOverdue && "border-destructive text-destructive",
                  isDueToday && !isOverdue && "border-yellow-500 text-yellow-600"
                )}
              >
                {isOverdue ? (
                  <Clock className="h-3 w-3 mr-1" />
                ) : (
                  <Calendar className="h-3 w-3 mr-1" />
                )}
                {isOverdue ? "Overdue" : isDueToday ? "Due Today" : format(dueDate, "MMM d")}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
