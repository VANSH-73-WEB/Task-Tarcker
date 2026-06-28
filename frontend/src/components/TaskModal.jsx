import { useState, useEffect } from "react";
import { useTasks } from "../context/TaskContext";
import { format } from "date-fns";

const INITIAL_FORM = {
  title: "",
  description: "",
  status: "todo",
  priority: "medium",
  dueDate: "",
  tags: "",
};

const ERRORS_INITIAL = {};

function validate(form) {
  const errors = {};
  if (!form.title.trim()) errors.title = "Title is required";
  else if (form.title.trim().length < 3) errors.title = "Title must be at least 3 characters";
  else if (form.title.trim().length > 100) errors.title = "Title must not exceed 100 characters";
  if (form.description.length > 500) errors.description = "Description must not exceed 500 characters";
  return errors;
}

export default function TaskModal({ task, onClose }) {
  const { createTask, updateTask } = useTasks();
  const isEdit = !!task;

  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState(ERRORS_INITIAL);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || "",
        description: task.description || "",
        status: task.status || "todo",
        priority: task.priority || "medium",
        dueDate: task.dueDate ? format(new Date(task.dueDate), "yyyy-MM-dd") : "",
        tags: task.tags?.join(", ") || "",
      });
    }
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: "" }));
  };

  const handleSubmit = async () => {
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      status: form.status,
      priority: form.priority,
      dueDate: form.dueDate || null,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    const ok = isEdit ? await updateTask(task._id, payload) : await createTask(payload);
    setSubmitting(false);
    if (ok) onClose();
  };

  // Close on backdrop click
  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdrop}>
      <div className="modal slide-in">
        <div className="modal-header">
          <h2>{isEdit ? "Edit Task" : "New Task"}</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {/* Title */}
          <div className="field">
            <label>Title <span className="required">*</span></label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="What needs to be done?"
              className={errors.title ? "error" : ""}
              autoFocus
            />
            {errors.title && <span className="error-msg">{errors.title}</span>}
          </div>

          {/* Description */}
          <div className="field">
            <label>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Add some details (optional)"
              rows={3}
              className={errors.description ? "error" : ""}
            />
            <div className="char-count" style={{ color: form.description.length > 450 ? "#ef4444" : "var(--text-muted)" }}>
              {form.description.length}/500
            </div>
            {errors.description && <span className="error-msg">{errors.description}</span>}
          </div>

          {/* Status + Priority */}
          <div className="field-row">
            <div className="field">
              <label>Status</label>
              <select name="status" value={form.status} onChange={handleChange}>
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
            <div className="field">
              <label>Priority</label>
              <select name="priority" value={form.priority} onChange={handleChange}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          {/* Due Date */}
          <div className="field">
            <label>Due Date</label>
            <input type="date" name="dueDate" value={form.dueDate} onChange={handleChange} />
          </div>

          {/* Tags */}
          <div className="field">
            <label>Tags <span className="hint">(comma separated)</span></label>
            <input
              name="tags"
              value={form.tags}
              onChange={handleChange}
              placeholder="design, backend, urgent"
            />
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose} disabled={submitting}>Cancel</button>
          <button className="btn-primary" onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Saving…" : isEdit ? "Save Changes" : "Create Task"}
          </button>
        </div>
      </div>

      <style>{`
        .modal-backdrop {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.7);
          display: flex; align-items: center; justify-content: center;
          z-index: 1000; padding: 20px;
          backdrop-filter: blur(4px);
        }
        .modal {
          background: var(--bg-surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-xl);
          width: 100%; max-width: 520px;
          box-shadow: var(--shadow-lg);
          max-height: 90vh;
          display: flex; flex-direction: column;
        }
        .modal-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 20px 24px 16px;
          border-bottom: 1px solid var(--border);
        }
        .modal-header h2 { font-size: 18px; font-weight: 700; }
        .close-btn {
          background: var(--bg-elevated);
          border: 1px solid var(--border);
          color: var(--text-secondary);
          width: 32px; height: 32px;
          border-radius: var(--radius-sm);
          font-size: 14px;
          transition: all var(--transition);
        }
        .close-btn:hover { background: var(--bg-overlay); color: var(--text-primary); }

        .modal-body { padding: 20px 24px; overflow-y: auto; display: flex; flex-direction: column; gap: 16px; }

        .field { display: flex; flex-direction: column; gap: 6px; }
        .field label { font-size: 13px; font-weight: 500; color: var(--text-secondary); }
        .required { color: var(--red); }
        .hint { font-weight: 400; color: var(--text-muted); }
        .char-count { font-size: 11px; text-align: right; margin-top: 2px; }

        .field input, .field textarea, .field select {
          background: var(--bg-elevated);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          color: var(--text-primary);
          padding: 10px 12px;
          font-size: 14px;
          transition: border-color var(--transition);
          width: 100%;
          resize: none;
        }
        .field input:focus, .field textarea:focus, .field select:focus {
          border-color: var(--indigo);
          box-shadow: 0 0 0 3px var(--indigo-dim);
        }
        .field input.error, .field textarea.error { border-color: var(--red); }
        .error-msg { font-size: 12px; color: var(--red); }

        .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

        .modal-footer {
          display: flex; gap: 10px; justify-content: flex-end;
          padding: 16px 24px 20px;
          border-top: 1px solid var(--border);
        }
        .btn-primary, .btn-secondary {
          padding: 10px 20px;
          border-radius: var(--radius-md);
          font-size: 14px; font-weight: 600;
          transition: all var(--transition);
        }
        .btn-primary {
          background: var(--indigo);
          color: #fff;
          border: 1px solid var(--indigo);
        }
        .btn-primary:hover:not(:disabled) { background: var(--indigo-light); }
        .btn-secondary {
          background: var(--bg-elevated);
          color: var(--text-secondary);
          border: 1px solid var(--border);
        }
        .btn-secondary:hover:not(:disabled) { background: var(--bg-overlay); color: var(--text-primary); }
        .btn-primary:disabled, .btn-secondary:disabled { opacity: 0.5; cursor: not-allowed; }

        @media (max-width: 480px) {
          .field-row { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
