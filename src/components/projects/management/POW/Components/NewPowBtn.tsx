import { yupResolver } from '@hookform/resolvers/yup';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { TbPlus } from 'react-icons/tb';
import { flexer } from '../../../../../constants/globalStyles';
import useFetch from '../../../../../Hooks/useFetch';
import useRole from '../../../../../Hooks/useRole';
import { expressPOW, powSchema } from '../../../../../validation/task';
import Button from '../../../../shared/Button';
import { PMStoreContext } from '../../Context';
import { ExpressSchema, createExpressPow, createPow, getPowsByProject } from 'apis/pow';
import { StoreContext } from 'context';
import CustomModal from 'components/shared/CustomModal/CustomModal';
import SelectField from 'components/shared/SelectField/SelectField';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { POW } from '../../types';
import InputField from 'components/shared/InputField';
import { ProfessionalSelectList } from 'components/shared/ProfessionalCard';
import { uploadFile } from 'Hooks/useProjectImages';
import { GrAttachment } from 'react-icons/gr';

interface NewPowBtnProps {
  isEmpty?: boolean;
}

export default function NewPowBtn({ isEmpty }: NewPowBtnProps) {
  const { selectedData, setContext, selectedProjectIndex, selectedProject } =
    useContext(StoreContext);
  const { projectId } = useParams() as { projectId: string };
  const { setContext: setPMContext, pows } = useContext(PMStoreContext);
  const [showModal, setModal] = useState(false);
  const { isLoading, load } = useFetch<POW>();
  const { role, isOwner, isProfessional } = useRole();
  const navigate = useNavigate();
  const [eeror, setError] = useState(1);
  const toggleModal = () => {
    if (showModal) reset();
    setModal((prev) => !prev);
  };
  const {
    reset,
    setValue,
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<{
    bidId: string;
    name: string;
    type?: 'contractor' | 'consultant';
    description?: string;
    professional?: string;
    docs?: File[];
  }>({
    reValidateMode: 'onChange',
    resolver: yupResolver(isEmpty ? expressPOW : powSchema)
  });
  const type = watch('type');

  let history = useLocation();

  const reload = async () => {
    // navigate(history.pathname);

    try {
      let powRes = await getPowsByProject(selectedProject._id);
      setPMContext((prev) => ({
        ...prev,
        hasFetchedAllPows: true,
        pows: powRes.data as POW[]
      }));
    } catch (error) {
      // setContext((prev) => ({
      //   ...prev,
      //   hasFetchedAllPows: true,
      //   pows: []
      // }));
    }
  };

  const submitHandler = handleSubmit(async (body) => {
    const payload = {
      ...body,
      projectId
    };
    if (isEmpty) {
      let files = payload.docs;
      let uploads = await Promise.all(
        files?.map((m) => uploadFile(m, selectedData._id, 'bids')) || []
      );
      let docs = [];
      for (let upload of uploads) {
        let file = upload.file;
        docs.push({
          name: file.name,
          key: upload.response.data?.data?.S3Key,
          meta: {
            size: file.size,
            type: file.type,
            name: file.name
          }
        });
      }
      payload.docs = docs as any;
    }

    load(isEmpty ? createExpressPow(payload as unknown as ExpressSchema) : createPow(payload)).then(
      async (res) => {
        reset();

        if (!isEmpty) {
          // 1. add the pow
          setPMContext((prev) => ({
            ...prev,
            pows: [res.data, ...prev.pows],
            tasks: { ...prev.tasks, [res.data._id]: [] }
          }));
          toggleModal();
          // 2. remove the pow reference on the bid #locally
          setContext((prev) => {
            const data = prev.menuProjects[selectedProjectIndex];
            const bids = data.literalBids.map((one) => {
              if (one._id !== res.data.bidId) return one;
              return { ...one, pow: res.data._id };
            });
            const newProjects = prev.menuProjects.map((project) => {
              if (project._id === data._id) {
                return { ...project, literalBids: bids };
              } else {
                return project;
              }
            });

            return {
              ...prev,
              menuProjects: newProjects
            };
          });
        } else {
          await reload();
          toggleModal();
          return;
        }
      }
    );
  });

  const WinnedBids = useMemo(() => {
    return selectedData.literalBids
      ? selectedData.literalBids.map((one) => ({
          value: one._id,
          label: one.name
        }))
      : [];
  }, [selectedData]);

  const ModalView = (
    <div className="w-11/12 lg:min-w-[400px] lg:max-w-[400px]">
      <div className={flexer}>
        <p className="font-Medium">{`${isEmpty ? 'Enable' : 'Create'} Program of works`}</p>
        <button className="text-sm text-bash" onClick={toggleModal}>
          Close
        </button>
      </div>
      <form onSubmit={submitHandler} className="w-full border-ashShade-3">
        {!isEmpty ? (
          <>
            <InputField
              label="Title"
              register={register('name')}
              error={errors.name?.message}
              placeholder="e.g Substructure"
            />
            <SelectField
              placeholder="Select bid"
              label="Select corresponding bid"
              onChange={(val) => setValue('bidId', val)}
              error={errors.bidId?.message}
              data={WinnedBids}
            />{' '}
          </>
        ) : (
          <>
            <InputField
              label="Name of POW"
              wrapperClassName=" !border-ashShade-3 !mt-2"
              register={register('name')}
              error={errors.name?.message}
              placeholder="e.g Substructure"
            />
            <SelectField
              value={type}
              wrapperClassName="!border-ashShade-3 !mt-2"
              placeholder="Select bid Type"
              label="Select Bid Type"
              onChange={(val: any) => setValue('type', val)}
              error={errors.type?.message}
              data={[
                { label: 'Contractor', value: 'contractor' },
                { label: 'Consultant', value: 'consultant' }
              ]}
            />
            <ProfessionalSelectList
              error={errors.professional?.message}
              type={type}
              onSelect={(x: string) => setValue('professional', x)}
            />

            <InputField
              isTextArea
              wrapperClassName=" !border-ashShade-3 !mt-2"
              label="Description"
              register={register('description')}
              error={errors.description?.message}
              placeholder="Enter a Description"
            />

            <DocumentInput
              inputClass="   text-bash"
              labelClass=" text-sm text-bash "
              label="Documents"
              onChange={(d) => {
                setValue('docs', d);
              }}
            />
          </>
        )}
        <div className={flexer + 'mt-5'}>
          <div />
          <div className={flexer + 'gap-4'}>
            <Button text="Cancel" type="secondary" btnType="button" onClick={toggleModal} />
            <Button text="Create" btnType="submit" isLoading={isLoading} />
          </div>
        </div>
      </form>
    </div>
  );

  return (
    <>
      <Button
        className={`${isOwner && 'hidden'}`}
        LeftIcon={isEmpty ? null : <TbPlus className="mr-2" />}
        text={
          isEmpty
            ? 'Skip Bid process'
            : window.innerWidth < 600
              ? 'Create'
              : 'Create Program of Works'
        }
        onClick={toggleModal}
        btnType="button"
      />
      <CustomModal
        visible={showModal}
        toggle={toggleModal}
        containerClassName="z-20"
        overlayClassName="opacity-50 backdrop-blur-0"
        className="backdrop-blur-0 drop-shadow-lg z-20">
        {ModalView}
      </CustomModal>
    </>
  );
}

interface DocumentInputProps {
  onChange: (files: File[]) => void;
  label?: string;
  labelClass?: string;
  inputClass?: string;
  error?: string;
  className?: string;
}

const DocumentInput = ({
  onChange,
  label,
  labelClass,
  inputClass,
  error,
  className
}: DocumentInputProps) => {
  const [files, setFiles] = useState<File[]>();
  let inputRef = useRef<any>();

  useEffect(() => {
    if (files) {
      onChange(files);
    }
  }, [files]);
  return (
    <div className={className}>
      <p className={labelClass}>{label}</p>
      <div
        onClick={(e) => {
          e.stopPropagation();
          inputRef?.current.click();
        }}
        className={`w-full flex hover:cursor-pointer outline-none flex-wrap items-center mt-1 gap-1 justify-between border border-ashShade-0 p-2 rounded-md ${inputClass}`}>
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="flex-1 flex flex-wrap ">
          {files && files?.length > 0
            ? files.map((m) => (
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                  }}>
                  {m.name}
                </span>
              ))
            : 'Select Files'}
        </div>

        <div
          onClick={(e) => {
            e.stopPropagation();
            inputRef?.current.click();
          }}
          className="p-2">
          <GrAttachment />
        </div>
      </div>
      {error && <span className="text-bred mt-1">{error}</span>}

      <input
        onChange={(e) => {
          let list = e.target.files;
          let files: File[] = Object.values(list ?? {});
          setFiles(files);
          // setFiles(files);
        }}
        accept=".jpg,.jpeg,.png,.avif,.pdf"
        ref={inputRef}
        multiple
        className=" hidden absolute "
        type="file"
      />
    </div>
  );
};

export { DocumentInput };
