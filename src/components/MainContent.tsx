import './MainContent.css'
import TaskCard from './TaskCard'

export default function MainContent() {
  const sampleTasks = [
    {
      id: 1,
      title: "Task 1",
      dueDate: "Due Today 13:00",
      isImportant: false,
      isDone: false
    },
    {
      id: 2,
      title: "Task 1",
      dueDate: "Due Today 13:00",
      isImportant: false,
      isDone: false
    },
    {
      id: 3,
      title: "Task 1",
      dueDate: "Due Today 13:00",
      isImportant: false,
      isDone: true
    }
  ];

  return (
    <div className="main-content">
      {/* Header */}
      <div className="content-header">
        <h1 className="title">All Tasks</h1>
        <div className="sort-controls">
          <span className="sort-label">Sort By:</span>
          <button className="sort-button active">Due ⌄</button>
          <button className="sort-button">Asc ⌄</button>
        </div>
      </div>

      {/* Tasks List */}
      <div className="tasks-section">
        {sampleTasks.filter(task => !task.isDone).map(task => (
          <TaskCard
            key={task.id}
            title={task.title}
            dueDate={task.dueDate}
            isImportant={task.isImportant}
            isDone={task.isDone}
          />
        ))}
      </div>

      {/* Completed Section */}
      <div className="completed-section">
        <div className="section-header">
          <span className="section-icon">⌄</span>
          <h3 className="section-title">Completed (1)</h3>
        </div>
        <div className="completed-tasks">
          {sampleTasks.filter(task => task.isDone).map(task => (
            <TaskCard
              key={task.id}
              title={task.title}
              dueDate={task.dueDate}
              isImportant={task.isImportant}
              isDone={task.isDone}
            />
          ))}
        </div>
      </div>

      {/* Add Task Button */}
      <div className="add-task-section">
        <button className="add-task-text">Create New Task</button>
        <button className="add-task-fab">+</button>
      </div>
    </div>
  )
}
