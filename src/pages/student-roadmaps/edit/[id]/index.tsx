import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getStudentRoadmapById, updateStudentRoadmapById } from 'apiSdk/student-roadmaps';
import { Error } from 'components/error';
import { studentRoadmapValidationSchema } from 'validationSchema/student-roadmaps';
import { StudentRoadmapInterface } from 'interfaces/student-roadmap';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { UserInterface } from 'interfaces/user';
import { RoadmapInterface } from 'interfaces/roadmap';
import { getUsers } from 'apiSdk/users';
import { getRoadmaps } from 'apiSdk/roadmaps';

function StudentRoadmapEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<StudentRoadmapInterface>(
    () => (id ? `/student-roadmaps/${id}` : null),
    () => getStudentRoadmapById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: StudentRoadmapInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateStudentRoadmapById(id, values);
      mutate(updated);
      resetForm();
      router.push('/student-roadmaps');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<StudentRoadmapInterface>({
    initialValues: data,
    validationSchema: studentRoadmapValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Edit Student Roadmap
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <AsyncSelect<UserInterface>
              formik={formik}
              name={'student_id'}
              label={'Select User'}
              placeholder={'Select User'}
              fetcher={getUsers}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.email}
                </option>
              )}
            />
            <AsyncSelect<RoadmapInterface>
              formik={formik}
              name={'roadmap_id'}
              label={'Select Roadmap'}
              placeholder={'Select Roadmap'}
              fetcher={getRoadmaps}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.title}
                </option>
              )}
            />
            <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
              Submit
            </Button>
          </form>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'student_roadmap',
  operation: AccessOperationEnum.UPDATE,
})(StudentRoadmapEditPage);
