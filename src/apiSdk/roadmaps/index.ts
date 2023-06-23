import axios from 'axios';
import queryString from 'query-string';
import { RoadmapInterface, RoadmapGetQueryInterface } from 'interfaces/roadmap';
import { GetQueryInterface } from '../../interfaces';

export const getRoadmaps = async (query?: RoadmapGetQueryInterface) => {
  const response = await axios.get(`/api/roadmaps${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createRoadmap = async (roadmap: RoadmapInterface) => {
  const response = await axios.post('/api/roadmaps', roadmap);
  return response.data;
};

export const updateRoadmapById = async (id: string, roadmap: RoadmapInterface) => {
  const response = await axios.put(`/api/roadmaps/${id}`, roadmap);
  return response.data;
};

export const getRoadmapById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/roadmaps/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteRoadmapById = async (id: string) => {
  const response = await axios.delete(`/api/roadmaps/${id}`);
  return response.data;
};
