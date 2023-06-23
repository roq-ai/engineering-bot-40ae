import axios from 'axios';
import queryString from 'query-string';
import { StudentRoadmapInterface, StudentRoadmapGetQueryInterface } from 'interfaces/student-roadmap';
import { GetQueryInterface } from '../../interfaces';

export const getStudentRoadmaps = async (query?: StudentRoadmapGetQueryInterface) => {
  const response = await axios.get(`/api/student-roadmaps${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createStudentRoadmap = async (studentRoadmap: StudentRoadmapInterface) => {
  const response = await axios.post('/api/student-roadmaps', studentRoadmap);
  return response.data;
};

export const updateStudentRoadmapById = async (id: string, studentRoadmap: StudentRoadmapInterface) => {
  const response = await axios.put(`/api/student-roadmaps/${id}`, studentRoadmap);
  return response.data;
};

export const getStudentRoadmapById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/student-roadmaps/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteStudentRoadmapById = async (id: string) => {
  const response = await axios.delete(`/api/student-roadmaps/${id}`);
  return response.data;
};
