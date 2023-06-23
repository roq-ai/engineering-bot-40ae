import { StudentRoadmapInterface } from 'interfaces/student-roadmap';
import { TaskInterface } from 'interfaces/task';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface RoadmapInterface {
  id?: string;
  title: string;
  field: string;
  team_member_id: string;
  mentor_id?: string;
  created_at?: any;
  updated_at?: any;
  student_roadmap?: StudentRoadmapInterface[];
  task?: TaskInterface[];
  user_roadmap_team_member_idTouser?: UserInterface;
  user_roadmap_mentor_idTouser?: UserInterface;
  _count?: {
    student_roadmap?: number;
    task?: number;
  };
}

export interface RoadmapGetQueryInterface extends GetQueryInterface {
  id?: string;
  title?: string;
  field?: string;
  team_member_id?: string;
  mentor_id?: string;
}
