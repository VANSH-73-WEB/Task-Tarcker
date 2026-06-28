import { useState, useEffect, useMemo, useCallback } from "react";
import { Toaster } from "react-hot-toast";
import { TaskProvider, useTasks } from "./context/TaskContext";
import TaskCard from "./components/TaskCard";
import TaskModal from "./components/TaskModal";
import Sidebar from "./components/Sidebar";

function TaskApp() {
  const { tasks, loading, error, filters, sort, fetchTasks, setFilters } = useTasks();
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters({ search: searchInput });
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput, setFilters]);

  // Fetch whenever filters or sort change
  useEffect(() => {
    const params = {};
    if (filters.status) params.status = filters.status;
    if (filters.priority) params.priority = filters.priority;
    if (filters.search) params.search = filters.search;
    params.sort = sort.field;
    params.order = sort.order;
    fetchTasks(params);
  }, [filters.status, filters.priority, filters.search, sort.field, sort.order, fetchTasks]);

  const handleEdit = useCallback((task) => {
    setEditTask(task);
    setShowModal(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setShowModal(false);
    setEditTask(null);
  }, []);

  const taskStats = useMemo(() => ({
    total: tasks.length,
    todo: tasks.filter((t) => t.status === "todo").length,
    inProgress: tasks.filter((t) => t.status === "in-progress").length,
    done: tasks.filter((t) => t.status === "done").length,
  }), [tasks]);

  return (
    <div className="app">
      {/* ─── Header ─────────────────────────────────────────────────── */}
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-icon">◈</span>
            <span className="logo-text">TaskFlow</span>
          </div>

          <div className="search-wrapper">
            <span className="search-icon">⌕</span>
            <input
              className="search-input"
              placeholder="Search tasks…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            {searchInput && (
              <button className="clear-search" onClick={() => setSearchInput("")}>✕</button>
            )}
          </div>

          <div className="header-actions">
            <button className="sidebar-toggle" onClick={() => setSidebarOpen((s) => !s)}>
              ☰
            </button>
            <button className="btn-new-task" onClick={() => setShowModal(true)}>
              + New Task
            </button>
          </div>
        </div>
      </header>

      {/* ─── Layout ─────────────────────────────────────────────────── */}
      <main className="main-layout">
        {/* Sidebar */}
        <div className={`sidebar-wrapper ${sidebarOpen ? "open" : ""}`}>
          <Sidebar taskStats={taskStats} />
        </div>

        {/* Backdrop for mobile sidebar */}
        {sidebarOpen && (
          <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Task Grid */}
        <section className="task-section">
          <div className="section-header">
            <h2 className="section-title">
              Tasks
              {tasks.length > 0 && <span className="task-count">{tasks.length}</span>}
            </h2>
            <div className="active-filters">
              {filters.status && (
                <span className="chip" onClick={() => setFilters({ status: "" })}>
                  {filters.status} ✕
                </span>
              )}
              {filters.priority && (
                <span className="chip" onClick={() => setFilters({ priority: "" })}>
                  {filters.priority} ✕
                </span>
              )}
            </div>
          </div>

          {/* States */}
          {loading && (
            <div className="state-center">
              <div className="spinner" />
              <p>Loading tasks…</p>
            </div>
          )}

          {!loading && error && (
            <div className="state-center error-state">
              <p>⚠ {error}</p>
              <button className="btn-retry" onClick={() => fetchTasks()}>Retry</button>
            </div>
          )}

          {!loading && !error && tasks.length === 0 && (
            <div className="state-center empty-state">
              <div className="empty-icon">◈</div>
              <h3>No tasks yet</h3>
              <p>Create your first task to get started</p>
              <button className="btn-new-task-lg" onClick={() => setShowModal(true)}>
                + Create Task
              </button>
            </div>
          )}

          {!loading && !error && tasks.length > 0 && (
            <div className="task-grid">
              {tasks.map((task) => (
                <TaskCard key={task._id} task={task} onEdit={handleEdit} />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* ─── Modal ──────────────────────────────────────────────────── */}
      {showModal && <TaskModal task={editTask} onClose={handleModalClose} />}

      <style>{`
        .app { min-height: 100vh; display: flex; flex-direction: column; }

        /* Header */
        .header {
          position: sticky; top: 0; z-index: 100;
          background: rgba(15,23,42,0.85);
          border-bottom: 1px solid var(--border);
          backdrop-filter: blur(12px);
        }
        .header-inner {
          max-width: 1200px; margin: 0 auto; padding: 12px 20px;
          display: flex; align-items: center; gap: 16px;
        }
        .logo { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
        .logo-icon { font-size: 20px; color: var(--indigo); }
        .logo-text { font-size: 18px; font-weight: 800; letter-spacing: -0.5px; }

        .search-wrapper {
          flex: 1; max-width: 400px; position: relative;
          display: flex; align-items: center;
        }
        .search-icon {
          position: absolute; left: 10px;
          color: var(--text-muted); font-size: 18px; pointer-events: none;
        }
        .search-input {
          width: 100%;
          background: var(--bg-elevated);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          color: var(--text-primary);
          padding: 8px 36px 8px 34px;
          font-size: 14px;
          transition: border-color var(--transition);
        }
        .search-input:focus { border-color: var(--indigo); box-shadow: 0 0 0 3px var(--indigo-dim); }
        .search-input::placeholder { color: var(--text-muted); }
        .clear-search {
          position: absolute; right: 8px;
          background: none; color: var(--text-muted);
          font-size: 12px; padding: 4px;
          transition: color var(--transition);
        }
        .clear-search:hover { color: var(--text-primary); }

        .header-actions { display: flex; align-items: center; gap: 10px; margin-left: auto; flex-shrink: 0; }
        .sidebar-toggle {
          display: none;
          background: var(--bg-elevated);
          border: 1px solid var(--border);
          color: var(--text-secondary);
          padding: 8px 12px;
          border-radius: var(--radius-md);
          font-size: 16px;
          transition: all var(--transition);
        }
        .sidebar-toggle:hover { background: var(--bg-overlay); color: var(--text-primary); }
        .btn-new-task {
          background: var(--indigo);
          color: #fff;
          border: none;
          border-radius: var(--radius-md);
          padding: 8px 16px;
          font-size: 14px; font-weight: 600;
          transition: all var(--transition);
          white-space: nowrap;
        }
        .btn-new-task:hover { background: var(--indigo-light); transform: translateY(-1px); }

        /* Layout */
        .main-layout {
          flex: 1;
          max-width: 1200px; margin: 0 auto;
          padding: 24px 20px;
          display: flex; gap: 24px; align-items: flex-start;
          width: 100%;
        }

        .sidebar-wrapper { position: sticky; top: 80px; }

        /* Task Section */
        .task-section { flex: 1; min-width: 0; }
        .section-header {
          display: flex; align-items: center; gap: 12px;
          margin-bottom: 20px; flex-wrap: wrap;
        }
        .section-title {
          font-size: 20px; font-weight: 700;
          display: flex; align-items: center; gap: 10px;
        }
        .task-count {
          font-size: 13px; font-weight: 600;
          background: var(--indigo-dim); color: var(--indigo-light);
          padding: 2px 10px; border-radius: 20px;
        }
        .active-filters { display: flex; gap: 6px; flex-wrap: wrap; }
        .chip {
          font-size: 12px; font-weight: 500;
          background: var(--bg-elevated);
          border: 1px solid var(--border);
          color: var(--text-secondary);
          padding: 3px 10px; border-radius: 20px;
          cursor: pointer; transition: all var(--transition);
        }
        .chip:hover { border-color: var(--red); color: var(--red); }

        /* Task Grid */
        .task-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 14px;
        }

        /* States */
        .state-center {
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          text-align: center; padding: 80px 20px;
          gap: 12px; color: var(--text-muted);
        }
        .spinner {
          width: 36px; height: 36px;
          border: 3px solid var(--border);
          border-top-color: var(--indigo);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        .error-state { color: var(--red); }
        .btn-retry {
          background: var(--bg-elevated); border: 1px solid var(--border);
          color: var(--text-secondary); padding: 8px 16px; border-radius: var(--radius-md);
          font-size: 14px; transition: all var(--transition); margin-top: 8px;
        }
        .btn-retry:hover { border-color: var(--indigo); color: var(--indigo-light); }
        .empty-icon { font-size: 48px; color: var(--border); margin-bottom: 8px; }
        .empty-state h3 { font-size: 18px; font-weight: 700; color: var(--text-secondary); }
        .empty-state p { font-size: 14px; }
        .btn-new-task-lg {
          background: var(--indigo); color: #fff; border: none;
          border-radius: var(--radius-md); padding: 10px 24px;
          font-size: 15px; font-weight: 600; margin-top: 8px;
          transition: all var(--transition);
        }
        .btn-new-task-lg:hover { background: var(--indigo-light); }

        /* Sidebar backdrop (mobile) */
        .sidebar-backdrop {
          display: none;
          position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 90;
        }

        /* ─── Responsive ────────────────────────────────────────────── */
        @media (max-width: 768px) {
          .main-layout { flex-direction: column; padding: 16px; }
          .sidebar-wrapper {
            position: fixed; left: 0; top: 0; bottom: 0; z-index: 95;
            background: var(--bg-base); padding: 80px 16px 16px;
            transform: translateX(-100%); transition: transform 0.25s ease;
            overflow-y: auto; width: 260px;
          }
          .sidebar-wrapper.open { transform: translateX(0); }
          .sidebar-backdrop { display: block; }
          .sidebar-toggle { display: flex; }
          .search-wrapper { max-width: none; }
          .task-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}

export default function App() {
  return (
    <TaskProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1e293b",
            color: "#f8fafc",
            border: "1px solid #334155",
            borderRadius: "10px",
            fontSize: "14px",
          },
        }}
      />
      <TaskApp />
    </TaskProvider>
  );
}
