import * as yup from 'yup';

export const completedTaskValidationSchema = yup.object().shape({
  student_roadmap_id: yup.string().nullable().required(),
  task_id: yup.string().nullable().required(),
});
