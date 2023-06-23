const mapping: Record<string, string> = {
  companies: 'company',
  'completed-tasks': 'completed_task',
  roadmaps: 'roadmap',
  'student-roadmaps': 'student_roadmap',
  tasks: 'task',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
