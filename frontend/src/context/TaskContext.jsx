import { createContext, useContext, useReducer, useCallback } from "react";
import { taskAPI } from "../utils/api";
import toast from "react-hot-toast";

const TaskContext = createContext(null);

const initialState = {
  tasks: [],
  loading: false,
  error: null,
  filters: { status: "", priority: "", search: "" },
  sort: { field: "createdAt", order: "desc" },
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_TASKS":
      return { ...state, tasks: action.payload, loading: false, error: null };
    case "ADD_TASK":
      return { ...state, tasks: [action.payload, ...state.tasks] };
    case "UPDATE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((t) => (t._id === action.payload._id ? action.payload : t)),
      };
    case "DELETE_TASK":
      return { ...state, tasks: state.tasks.filter((t) => t._id !== action.payload) };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    case "SET_FILTERS":
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case "SET_SORT":
      return { ...state, sort: action.payload };
    default:
      return state;
  }
}

export function TaskProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchTasks = useCallback(async (params = {}) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const res = await taskAPI.getAll(params);
      dispatch({ type: "SET_TASKS", payload: res.data.data });
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to fetch tasks";
      dispatch({ type: "SET_ERROR", payload: msg });
      toast.error(msg);
    }
  }, []);

  const createTask = useCallback(async (data) => {
    try {
      const res = await taskAPI.create(data);
      dispatch({ type: "ADD_TASK", payload: res.data.data });
      toast.success("Task created!");
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create task");
      return false;
    }
  }, []);

  const updateTask = useCallback(async (id, data) => {
    try {
      const res = await taskAPI.update(id, data);
      dispatch({ type: "UPDATE_TASK", payload: res.data.data });
      toast.success("Task updated!");
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update task");
      return false;
    }
  }, []);

  const deleteTask = useCallback(async (id) => {
    try {
      await taskAPI.delete(id);
      dispatch({ type: "DELETE_TASK", payload: id });
      toast.success("Task deleted");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete task");
    }
  }, []);

  const updateStatus = useCallback(async (id, status) => {
    try {
      const res = await taskAPI.updateStatus(id, status);
      dispatch({ type: "UPDATE_TASK", payload: res.data.data });
    } catch (err) {
      toast.error("Failed to update status");
    }
  }, []);

  const setFilters = useCallback((filters) => {
    dispatch({ type: "SET_FILTERS", payload: filters });
  }, []);

  const setSort = useCallback((sort) => {
    dispatch({ type: "SET_SORT", payload: sort });
  }, []);

  return (
    <TaskContext.Provider
      value={{
        ...state,
        fetchTasks,
        createTask,
        updateTask,
        deleteTask,
        updateStatus,
        setFilters,
        setSort,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export const useTasks = () => {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error("useTasks must be used within TaskProvider");
  return ctx;
};
