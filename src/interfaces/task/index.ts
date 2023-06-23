import { CompletedTaskInterface } from 'interfaces/completed-task';
import { RoadmapInterface } from 'interfaces/roadmap';
import { GetQueryInterface } from 'interfaces';

export interface TaskInterface {
  id?: string;
  title: string;
  description?: string;
  roadmap_id: string;
  created_at?: any;
  updated_at?: any;
  completed_task?: CompletedTaskInterface[];
  roadmap?: RoadmapInterface;
  _count?: {
    completed_task?: number;
  };
}

export interface TaskGetQueryInterface extends GetQueryInterface {
  id?: string;
  title?: string;
  description?: string;
  roadmap_id?: string;
}
