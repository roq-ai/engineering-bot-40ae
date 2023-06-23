import { CompletedTaskInterface } from 'interfaces/completed-task';
import { UserInterface } from 'interfaces/user';
import { RoadmapInterface } from 'interfaces/roadmap';
import { GetQueryInterface } from 'interfaces';

export interface StudentRoadmapInterface {
  id?: string;
  student_id: string;
  roadmap_id: string;
  created_at?: any;
  updated_at?: any;
  completed_task?: CompletedTaskInterface[];
  user?: UserInterface;
  roadmap?: RoadmapInterface;
  _count?: {
    completed_task?: number;
  };
}

export interface StudentRoadmapGetQueryInterface extends GetQueryInterface {
  id?: string;
  student_id?: string;
  roadmap_id?: string;
}
