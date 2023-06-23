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
import { createCompletedTask } from 'apiSdk/completed-tasks';
import { Error } from 'components/error';
import { completedTaskValidationSchema } from 'validationSchema/completed-tasks';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { StudentRoadmapInterface } from 'interfaces/student-roadmap';
import { TaskInterface } from 'interfaces/task';
import { getStudentRoadmaps } from 'apiSdk/student-roadmaps';
import { getTasks } from 'apiSdk/tasks';
import { CompletedTaskInterface } from 'interfaces/completed-task';

function CompletedTaskCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: CompletedTaskInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createCompletedTask(values);
      resetForm();
      router.push('/completed-tasks');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<CompletedTaskInterface>({
    initialValues: {
      student_roadmap_id: (router.query.student_roadmap_id as string) ?? null,
      task_id: (router.query.task_id as string) ?? null,
    },
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
            Create Completed Task
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
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
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'completed_task',
  operation: AccessOperationEnum.CREATE,
})(CompletedTaskCreatePage);
