import useFetch from 'Hooks/useFetch';
import { displayError, displayWarning } from 'Utils';
import { postForm } from 'apis/postForm';
import Button from 'components/shared/Button';
import CompleteModal from 'components/shared/CompleteModal/CompleteModal';
import SelectField from 'components/shared/SelectField';
import React, { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { GoOrganization } from 'react-icons/go';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { updateProjectManager } from 'store/slices/projectManagerSlice';

const CompanyNameModal = ({
  defaultValue,
  uniqueClassName,
  userId
}: {
  defaultValue?: string;
  uniqueClassName: string;
  userId: string;
}) => {
  const { setLoader, isLoading } = useFetch();
  const [hasFormChanged, setFormChanges] = useState(false);
  let dispatch = useAppDispatch();
  const { control, handleSubmit } = useForm<{ companyName: string }>({
    defaultValues: { companyName: defaultValue }
  });
  let developers = useAppSelector((m) => m.developers);

  let companyList = useMemo(() => {
    let companies = developers.data
      .map((m) => m.companyName)
      .filter((m) => m)
      .map((m) => {
        return { value: m, label: m };
      });
    return [{ label: 'General', value: 'General' }, ...companies] || [];
  }, [developers.data]);

  const submitHandler = handleSubmit(async ({ companyName }) => {
    setLoader(true);
    let { response, e } = await postForm(
      'patch',
      'users/update-company-name',
      { userId, companyName },
      'iam'
    );
    if (response) {
      dispatch(updateProjectManager(response.data.data));
    } else {
      displayError(e.message);
    }
    setLoader(false);
  });

  return (
    <CompleteModal
      initialState={true}
      toggleButton={
        <button
          className={' gap-2 w-full p-2 rounded-md group hover:bg-bbg hidden ' + uniqueClassName}>
          {isLoading ? (
            <AiOutlineLoading3Quarters className="animate-spin text-bash group-hover:text-black" />
          ) : (
            <GoOrganization className={'text-bash group-hover:text-black ' + uniqueClassName} />
          )}
          <p
            className={'text-sm truncate text-bash ml-1 group-hover:text-black ' + uniqueClassName}>
            Edit company name
          </p>
        </button>
      }
      title="Edit company name">
      <Controller
        control={control}
        name="companyName"
        render={({ field: { onChange, value } }) => (
          <SelectField
            value={value}
            data={companyList}
            label="Company Name"
            placeholder="Select Company"
            onChange={(val) => {
              if (!hasFormChanged) setFormChanges(true);
              onChange(val);
            }}
          />
        )}
      />
      <Button
        text="Save"
        {...{ isLoading }}
        className="w-full"
        onClick={submitHandler}
        type={hasFormChanged ? 'primary' : 'muted'}
      />
    </CompleteModal>
  );
};

export default CompanyNameModal;
