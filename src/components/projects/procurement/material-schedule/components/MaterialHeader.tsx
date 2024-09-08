import Button from 'components/shared/Button';
import { TbPlus } from 'react-icons/tb';
import { FC, useState } from 'react';
import { MaterialScheduleRecord, MaterialRecord } from '../types';
import AddMaterialModal from '../AddMaterialModal';
import { TbDownload } from 'react-icons/tb';
import UploadFile from './UploadFile';
import useMaterialSchedule from 'Hooks/useMaterialSchedule';

interface AddMaterialRecordProps {
  onClose: () => void;
activeTab: string;
  // setScheduleId: (id: string | null) => void;
  onAdd?: (data: any) => void;
}

const AddMaterialRecord: FC<AddMaterialRecordProps> = ({ onClose, activeTab, onAdd }) => {
  const [showModal, setShowModal] = useState(false);
  // const { triggerRefresh } = useMaterialSchedule();
  const [showUpload, setShowUpload] = useState(false);
  const [editing, setEditing] = useState<MaterialRecord | undefined>(undefined);

  const handleUploadMaterialClick = () => {
    setShowUpload(true);
  };

  return (
    <div>
      {showModal && (
        <AddMaterialModal
          onAdd={onAdd}
          isEditing={Boolean(editing)}
          value={editing}
          closer={() => {
            setShowModal(false);
            setEditing(undefined);
          }}
          // scheduleId={scheduleId}
          activeTab={activeTab}
        />
      )}

      {showUpload && (
        <UploadFile
          closer={() => {
            setShowUpload(false);
          }}
        />
      )}

      <div className="absolute w-full mt-2 bg-white rounded-md shadow-md">
        <Button
          text="Upload Excel File"
          onClick={() => {
            handleUploadMaterialClick();
          }}
          type="transparent"
          className="group flex items-center hover:rounded-none px-0 mx-0 gap-2"
          style={{
            width: '100%',
            padding: '8px 0px 8px 8px',
            border: 'none',
            borderRadius: 'none'
          }}
          textStyle="text-bash group-hover:text-[#437ADB] transition-colors duration-300 flex-1 text-left"
          LeftIcon={
            <TbDownload className="rotate-180 text-[#9099A8] group-hover:text-[#437ADB] transition-colors duration-300" />
          }
        />
        <Button
          text="Add Material"
          onClick={() => {
            setShowModal(true);
          }}
          type="transparent"
          className="group flex items-center hover:rounded-none px-0 mx-0 gap-2"
          style={{
            width: '100%',
            padding: '8px 0px 8px 8px',
            border: 'none',
            borderRadius: 'none'
          }}
          textStyle="text-bash group-hover:text-[#437ADB] transition-colors duration-300 flex-1 text-left"
          LeftIcon={
            <TbPlus className="rotate-180 text-[#9099A8] group-hover:text-[#437ADB] transition-colors duration-300" />
          }
        />
      </div>
    </div>
  );
};

export default AddMaterialRecord;
