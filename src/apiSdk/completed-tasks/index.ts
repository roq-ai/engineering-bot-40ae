import axios from 'axios';
import queryString from 'query-string';
import { CompletedTaskInterface, CompletedTaskGetQueryInterface } from 'interfaces/completed-task';
import { GetQueryInterface } from '../../interfaces';

export const getCompletedTasks = async (query?: CompletedTaskGetQueryInterface) => {
  const response = await axios.get(`/api/completed-tasks${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createCompletedTask = async (completedTask: CompletedTaskInterface) => {
  const response = await axios.post('/api/completed-tasks', completedTask);
  return response.data;
};

export const updateCompletedTaskById = async (id: string, completedTask: CompletedTaskInterface) => {
  const response = await axios.put(`/api/completed-tasks/${id}`, completedTask);
  return response.data;
};

export const getCompletedTaskById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/completed-tasks/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteCompletedTaskById = async (id: string) => {
  const response = await axios.delete(`/api/completed-tasks/${id}`);
  return response.data;
};
