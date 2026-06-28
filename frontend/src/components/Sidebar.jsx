import { useTasks } from "../context/TaskContext";

const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "todo", label: "To Do" },
  { value: "in-progress", label: "In Progress" },
  { value: "done", label: "Done" },
];

const PRIORITY_OPTIONS = [
  { value: "", label: "All Priorities" },
  { value: "high", label: "🔴 High" },
  { value: "medium", label: "🟡 Medium" },
  { value: "low", label: "🟢 Low" },
];

const SORT_OPTIONS = [
  { value: "createdAt", label: "Date Created" },
  { value: "dueDate", label: "Due Date" },
  { value: "title", label: "Title (A–Z)" },
  { value: "priority", label: "Priority" },
];

export default function Sidebar({ taskStats }) {
  const { filters, sort, setFilters, setSort } = useTasks();

  const handleFilter = (key, value) => setFilters({ [key]: value });
  const handleSort = (field) => {
    if (sort.field === field) {
      setSort({ field, order: sort.order === "asc" ? "desc" : "asc" });
    } else {
      setSort({ field, order: "desc" });
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <h3 className="section-title">Overview</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-number">{taskStats.total}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat-card" style={{ "--accent": "#6366f1" }}>
            <span className="stat-number" style={{ color: "#6366f1" }}>{taskStats.todo}</span>
            <span className="stat-label">To Do</span>
          </div>
          <div className="stat-card" style={{ "--accent": "#f59e0b" }}>
            <span className="stat-number" style={{ color: "#f59e0b" }}>{taskStats.inProgress}</span>
            <span className="stat-label">In Progress</span>
          </div>
          <div className="stat-card" style={{ "--accent": "#10b981" }}>
            <span className="stat-number" style={{ color: "#10b981" }}>{taskStats.done}</span>
            <span className="stat-label">Done</span>
          </div>
        </div>

        {taskStats.total > 0 && (
          <div className="progress-bar-wrapper">
            <div
              className="progress-bar-fill"
              style={{ width: `${Math.round((taskStats.done / taskStats.total) * 100)}%` }}
            />
            <span className="progress-label">
              {Math.round((taskStats.done / taskStats.total) * 100)}% complete
            </span>
          </div>
        )}
      </div>

      <div className="sidebar-section">
        <h3 className="section-title">Filter</h3>
        <div className="filter-group">
          <label>Status</label>
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              className={`filter-btn ${filters.status === opt.value ? "active" : ""}`}
              onClick={() => handleFilter("status", opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <div className="filter-group">
          <label>Priority</label>
          {PRIORITY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              className={`filter-btn ${filters.priority === opt.value ? "active" : ""}`}
              onClick={() => handleFilter("priority", opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="sidebar-section">
        <h3 className="section-title">Sort By</h3>
        <div className="sort-group">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              className={`sort-btn ${sort.field === opt.value ? "active" : ""}`}
              onClick={() => handleSort(opt.value)}
            >
              {opt.label}
              {sort.field === opt.value && (
                <span className="sort-arrow">{sort.order === "asc" ? " ↑" : " ↓"}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <style>{`
        .sidebar {
          width: 240px;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .sidebar-section {
          background: var(--bg-surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 16px;
        }
        .section-title {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--text-muted);
          margin-bottom: 12px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-bottom: 14px;
        }
        .stat-card {
          background: var(--bg-elevated);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: 10px;
          display: flex; flex-direction: column; gap: 2px;
        }
        .stat-number { font-size: 22px; font-weight: 800; color: var(--text-primary); }
        .stat-label { font-size: 11px; color: var(--text-muted); font-weight: 500; }

        .progress-bar-wrapper {
          background: var(--bg-elevated);
          border-radius: 20px;
          height: 6px;
          position: relative;
          overflow: hidden;
        }
        .progress-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--indigo), var(--green));
          border-radius: 20px;
          transition: width 0.4s ease;
        }
        .progress-label {
          display: block;
          font-size: 11px;
          color: var(--text-muted);
          text-align: right;
          margin-top: 6px;
        }

        .filter-group, .sort-group {
          display: flex; flex-direction: column; gap: 4px; margin-bottom: 12px;
        }
        .filter-group:last-child, .sort-group:last-child { margin-bottom: 0; }
        .filter-group label {
          font-size: 11px; font-weight: 600; color: var(--text-muted);
          text-transform: uppercase; letter-spacing: 0.5px;
          margin-bottom: 4px; margin-top: 4px;
        }

        .filter-btn, .sort-btn {
          background: transparent;
          border: 1px solid transparent;
          color: var(--text-secondary);
          text-align: left;
          padding: 7px 10px;
          border-radius: var(--radius-sm);
          font-size: 13px;
          transition: all var(--transition);
        }
        .filter-btn:hover, .sort-btn:hover {
          background: var(--bg-elevated);
          color: var(--text-primary);
        }
        .filter-btn.active, .sort-btn.active {
          background: var(--indigo-dim);
          border-color: var(--indigo);
          color: var(--indigo-light);
          font-weight: 600;
        }
        .sort-arrow { color: var(--indigo-light); }
      `}</style>
    </aside>
  );
}
