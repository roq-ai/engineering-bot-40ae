import { StudentRoadmapInterface } from 'interfaces/student-roadmap';
import { TaskInterface } from 'interfaces/task';
import { GetQueryInterface } from 'interfaces';

export interface CompletedTaskInterface {
  id?: string;
  student_roadmap_id: string;
  task_id: string;
  created_at?: any;
  updated_at?: any;

  student_roadmap?: StudentRoadmapInterface;
  task?: TaskInterface;
  _count?: {};
}

export interface CompletedTaskGetQueryInterface extends GetQueryInterface {
  id?: string;
  student_roadmap_id?: string;
  task_id?: string;
}
