/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import axios from "@/lib/axios";

interface Task {
  _id: string;
  taskName: string;
}

interface TaskDeleteDialogProps {
  task: Task;
  onClose: () => void;
}

const TaskDeleteDialog: React.FC<TaskDeleteDialogProps> = ({ task, onClose }) => {
  const [loading, setLoading] = useState<boolean>(false); // State to track API call loading

  const handleDelete = async () => {
    try {
      setLoading(true); // Start loading
      const response = await axios.delete(`/task/delete`, {
        data: { taskId: task._id }, // Pass the taskId in the request body
      });

      if (response.status === 200) {
        console.log("Task deleted successfully.");
        onClose(); // Close the dialog on success
      }
      window.location.reload();
    } catch (error: any) {
      console.error("Error deleting task:", error.response?.data || error.message);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Task</DialogTitle>
        </DialogHeader>
        <p>Are you sure you want to delete the task &quot;{task.taskName}&quot;?</p>
        <DialogFooter>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDeleteDialog;
