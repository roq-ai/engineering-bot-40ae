import * as yup from 'yup';

export const roadmapValidationSchema = yup.object().shape({
  title: yup.string().required(),
  field: yup.string().required(),
  team_member_id: yup.string().nullable().required(),
  mentor_id: yup.string().nullable(),
});
