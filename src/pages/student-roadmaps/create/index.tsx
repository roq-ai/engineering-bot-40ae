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
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createStudentRoadmap } from 'apiSdk/student-roadmaps';
import { Error } from 'components/error';
import { studentRoadmapValidationSchema } from 'validationSchema/student-roadmaps';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { UserInterface } from 'interfaces/user';
import { RoadmapInterface } from 'interfaces/roadmap';
import { getUsers } from 'apiSdk/users';
import { getRoadmaps } from 'apiSdk/roadmaps';
import { StudentRoadmapInterface } from 'interfaces/student-roadmap';

function StudentRoadmapCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: StudentRoadmapInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createStudentRoadmap(values);
      resetForm();
      router.push('/student-roadmaps');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<StudentRoadmapInterface>({
    initialValues: {
      student_id: (router.query.student_id as string) ?? null,
      roadmap_id: (router.query.roadmap_id as string) ?? null,
    },
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
            Create Student Roadmap
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
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
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'student_roadmap',
  operation: AccessOperationEnum.CREATE,
})(StudentRoadmapCreatePage);
