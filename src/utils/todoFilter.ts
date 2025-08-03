import type { Task } from "../stores/todoStore";

export default class TodoFilter {
  /**
   * Filters tasks that are overdue (past their due date and not completed)
   * 
   * Task characteristics:
   * - Has a due date
   * - Due date is earlier than current time
   * - Not completed
   * 
   * @param tasks Array of tasks to filter
   * @returns Array of tasks that have a due date earlier than now and are not completed
   */
  static overdue(tasks: Task[]) {
    return tasks.filter(
      (task) =>
        task.dueDate && new Date(task.dueDate) < new Date() && !task.completed
    );
  }

  /**
   * Filters tasks that are due today (same date as today and not completed)
   * 
   * Task characteristics:
   * - Has a due date
   * - Due date is on the same calendar day as today
   * - Due date is not in the past (>= current time)
   * - Not completed
   * 
   * @param tasks Array of tasks to filter
   * @returns Array of tasks that have a due date today, are not overdue, and are not completed
   */
  static today(tasks: Task[]) {
    const now = new Date();
    return tasks.filter(
      (task) =>
        task.dueDate &&
        new Date(task.dueDate).toDateString() === now.toDateString() &&
        new Date(task.dueDate) >= now &&
        !task.completed
    );
  }

  /**
   * Filters tasks that are due in the future (after tomorrow or have no due date, and not completed)
   * 
   * Task characteristics:
   * - Either has a due date after tomorrow (>= tomorrow at 00:00:00) OR has no due date
   * - Not completed
   * 
   * @param tasks Array of tasks to filter
   * @returns Array of tasks that either have a due date after tomorrow or no due date, and are not completed
   */
  static future(tasks: Task[]) {
    const now = new Date();
    const tomorrow = new Date();
    tomorrow.setHours(0, 0, 0, 0);
    tomorrow.setDate(now.getDate() + 1);

    return tasks.filter((task) =>
      task.dueDate
        ? new Date(task.dueDate) >= tomorrow && !task.completed
        : !task.completed
    );
  }

  /**
   * Filters tasks that have been completed
   * 
   * Task characteristics:
   * - Completed flag is true
   * 
   * @param tasks Array of tasks to filter
   * @returns Array of tasks that are marked as completed
   */
  static completed(tasks: Task[]) {
    return tasks.filter((task) => task.completed);
  }

  /**
   * Filters tasks that are marked as important
   * 
   * Task characteristics:
   * - isImportant flag is true
   * 
   * @param tasks Array of tasks to filter
   * @returns Array of tasks that have the isImportant flag set to true
   */
  static important(tasks: Task[]) {
    return tasks.filter((task) => task.isImportant);
  }
}
