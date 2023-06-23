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
import { getCompletedTaskById, updateCompletedTaskById } from 'apiSdk/completed-tasks';
import { Error } from 'components/error';
import { completedTaskValidationSchema } from 'validationSchema/completed-tasks';
import { CompletedTaskInterface } from 'interfaces/completed-task';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { StudentRoadmapInterface } from 'interfaces/student-roadmap';
import { TaskInterface } from 'interfaces/task';
import { getStudentRoadmaps } from 'apiSdk/student-roadmaps';
import { getTasks } from 'apiSdk/tasks';

function CompletedTaskEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<CompletedTaskInterface>(
    () => (id ? `/completed-tasks/${id}` : null),
    () => getCompletedTaskById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: CompletedTaskInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateCompletedTaskById(id, values);
      mutate(updated);
      resetForm();
      router.push('/completed-tasks');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<CompletedTaskInterface>({
    initialValues: data,
    validationSchema: completedTaskValidationSchema,
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
            Edit Completed Task
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
            <AsyncSelect<StudentRoadmapInterface>
              formik={formik}
              name={'student_roadmap_id'}
              label={'Select Student Roadmap'}
              placeholder={'Select Student Roadmap'}
              fetcher={getStudentRoadmaps}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.id}
                </option>
              )}
            />
            <AsyncSelect<TaskInterface>
              formik={formik}
              name={'task_id'}
              label={'Select Task'}
              placeholder={'Select Task'}
              fetcher={getTasks}
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
  entity: 'completed_task',
  operation: AccessOperationEnum.UPDATE,
})(CompletedTaskEditPage);
