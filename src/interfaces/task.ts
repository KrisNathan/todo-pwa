export interface Task {
  id: string;
  title: string;
  completed: boolean;
  dueDate: Date | null;
  isImportant: boolean;

  listId: string;
}

