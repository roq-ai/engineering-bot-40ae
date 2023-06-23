import * as yup from 'yup';

export const studentRoadmapValidationSchema = yup.object().shape({
  student_id: yup.string().nullable().required(),
  roadmap_id: yup.string().nullable().required(),
});
