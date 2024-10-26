import axios from "axios";
import { TASK_BASE_URL } from "@/lib/config";
console.log(TASK_BASE_URL)

export const getTasksApi = async () => {
  try {
    const response = await axios.get(`${TASK_BASE_URL}/task/getTask`);
    const tasks = response.data;
    return tasks;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};
