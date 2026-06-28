import { useState } from "react";
import { format, isPast, isToday, parseISO } from "date-fns";
import { useTasks } from "../context/TaskContext";

const PRIORITY_CONFIG = {
  high: { label: "High", color: "#ef4444", bg: "rgba(239,68,68,0.12)" },
  medium: { label: "Medium", color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
  low: { label: "Low", color: "#10b981", bg: "rgba(16,185,129,0.12)" },
};

const STATUS_OPTIONS = [
  { value: "todo", label: "To Do" },
  { value: "in-progress", label: "In Progress" },
  { value: "done", label: "Done" },
];

export default function TaskCard({ task, onEdit }) {
  const { deleteTask, updateStatus } = useTasks();
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const priority = PRIORITY_CONFIG[task.priority];

  const dueDateObj = task.dueDate ? parseISO(task.dueDate) : null;
  const isOverdue = dueDateObj && isPast(dueDateObj) && task.status !== "done";
  const isDueToday = dueDateObj && isToday(dueDateObj);

  const handleDelete = async () => {
    if (!confirmDelete) { setConfirmDelete(true); return; }
    setDeleting(true);
    await deleteTask(task._id);
  };

  const handleStatusChange = (e) => updateStatus(task._id, e.target.value);

  return (
    <div
      className="task-card"
      style={{
        animation: "fadeIn 0.2s ease forwards",
        ...(isOverdue && { animation: "fadeIn 0.2s ease forwards, pulse-ring 2s infinite" }),
      }}
    >
      {/* Priority bar */}
      <div className="priority-bar" style={{ background: priority.color }} />

      <div className="card-body">
        {/* Header row */}
        <div className="card-header">
          <span className="priority-badge" style={{ color: priority.color, background: priority.bg }}>
            {priority.label}
          </span>
          {task.status === "done" && <span className="done-badge">✓ Done</span>}
          {isOverdue && <span className="overdue-badge">⚠ Overdue</span>}
          {isDueToday && task.status !== "done" && <span className="today-badge">Today</span>}
        </div>

        {/* Title */}
        <h3 className="task-title" style={{ textDecoration: task.status === "done" ? "line-through" : "none" }}>
          {task.title}
        </h3>

        {/* Description */}
        {task.description && (
          <p className="task-desc">{task.description}</p>
        )}

        {/* Tags */}
        {task.tags?.length > 0 && (
          <div className="tags-row">
            {task.tags.map((tag) => (
              <span key={tag} className="tag">#{tag}</span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="card-footer">
          <div className="footer-left">
            {/* Status selector */}
            <select className="status-select" value={task.status} onChange={handleStatusChange}>
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>

            {/* Due date */}
            {dueDateObj && (
              <span className="due-date" style={{ color: isOverdue ? "#ef4444" : isDueToday ? "#f59e0b" : "var(--text-muted)" }}>
                📅 {format(dueDateObj, "MMM d, yyyy")}
              </span>
            )}
          </div>

          <div className="card-actions">
            <button className="btn-icon" onClick={() => onEdit(task)} title="Edit task">
              ✏️
            </button>
            <button
              className={`btn-icon ${confirmDelete ? "confirm-delete" : ""}`}
              onClick={handleDelete}
              disabled={deleting}
              title={confirmDelete ? "Click again to confirm" : "Delete task"}
            >
              {deleting ? "⌛" : confirmDelete ? "⚠️" : "🗑️"}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .task-card {
          position: relative;
          background: var(--bg-surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          overflow: hidden;
          transition: transform var(--transition), box-shadow var(--transition), border-color var(--transition);
        }
        .task-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
          border-color: var(--border-light);
        }
        .priority-bar {
          height: 3px;
          width: 100%;
        }
        .card-body { padding: 16px; }
        .card-header { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; flex-wrap: wrap; }

        .priority-badge, .done-badge, .overdue-badge, .today-badge {
          font-size: 11px;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: 20px;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }
        .done-badge { color: var(--green); background: var(--green-dim); }
        .overdue-badge { color: var(--red); background: var(--red-dim); }
        .today-badge { color: var(--amber); background: var(--amber-dim); }

        .task-title {
          font-size: 15px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 6px;
          line-height: 1.4;
        }
        .task-desc {
          font-size: 13px;
          color: var(--text-secondary);
          margin-bottom: 10px;
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .tags-row { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 12px; }
        .tag {
          font-size: 11px;
          color: var(--indigo-light);
          background: var(--indigo-dim);
          padding: 2px 8px;
          border-radius: 20px;
        }
        .card-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 12px; gap: 8px; }
        .footer-left { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }

        .status-select {
          background: var(--bg-elevated);
          color: var(--text-primary);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          padding: 4px 8px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: border-color var(--transition);
        }
        .status-select:hover { border-color: var(--indigo); }

        .due-date { font-size: 12px; white-space: nowrap; }

        .card-actions { display: flex; gap: 6px; }
        .btn-icon {
          background: var(--bg-elevated);
          border: 1px solid var(--border);
          color: var(--text-secondary);
          width: 32px; height: 32px;
          border-radius: var(--radius-sm);
          display: flex; align-items: center; justify-content: center;
          font-size: 14px;
          transition: all var(--transition);
        }
        .btn-icon:hover { background: var(--bg-overlay); border-color: var(--border-light); }
        .btn-icon.confirm-delete { border-color: var(--red); background: var(--red-dim); }
        .btn-icon:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>
    </div>
  );
}
