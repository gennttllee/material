import SuperModal from 'components/shared/SuperModal';
import React, { useState } from 'react';
import { CgClose } from 'react-icons/cg';
import Button from 'components/shared/Button';
import CloudUpload from 'assets/cloud-add.png';
import ExcelSheet from 'assets/ExcelSheet.png';

interface Props {
  closer: () => void;
}
const UploadFile = ({ closer }: Props) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    setFile(droppedFile);
  };

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    setFile(selectedFile || null);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setProgress(0);
  };

  return (
    <div>
      <SuperModal
        classes="bg-black bg-opacity-60 flex flex-col items-center overflow-y-auto"
        closer={closer}>
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
          className=" bg-white rounded-md p-6 mt-20 mb-10 w-1/2 max-w-[575px] ">
          <div className="flex items-center justify-between mb-2">
            <p className=" text-xl font-medium text-black">Upload Excel File</p>

            <span className=" cursor-pointer text-sm text-bash" onClick={closer}>
              <CgClose fontSize={24} color="#9099A8" />
            </span>
          </div>

          <p className="text-base font-medium font-satoshi">
            <span className="text-bash">Ensure your columns are arranged properly </span>
            <a href="#" download className="hover:underline decoration-bblue">
              <span className="text-bblue">Download our example</span>
            </a>
          </p>

          <div
            className="mt-5 upload-box border-2 border-ashShade-2 border-dashed rounded-md h-[208px] flex items-center justify-center"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}>
            <div className="upload-placeholder">
              <img
                src={CloudUpload}
                alt="cloud upload"
                className="mx-auto mb-2 h-[84px] w-[84px]"
              />

              <p className="font-Medium">
                <span className="text-bash ">Drag and Drop to upload or </span>
                <label
                  htmlFor="file-input"
                  className="text-bblue underline decoration-bblue hover:cursor-pointer">
                  Browse
                </label>
              </p>
              <input
                id="file-input"
                type="file"
                onChange={handleFileInput}
                style={{ display: 'none' }}
              />
            </div>
          </div>

          {file && (
            <div className="border border-pbg rounded-md mt-6 h-[88px] max-h-[88px] flex items-center px-4">
              <div className="w-full">
                <div className="flex justify-between items-center">
                  <p className="flex items-center gap-3">
                    <span>
                      <img src={ExcelSheet} alt="Excel Sheet Icon" className="w-[32px] h-[32px]" />
                    </span>
                    <p className="flex flex-col gap-1">
                      <span className="text-sm text-bblack-1 font-Medium">{file.name}</span>
                      <span className="text-bash text-xs font-Medium">{file.size / 1000} KB</span>
                    </p>
                  </p>
                  <button onClick={handleRemoveFile}>
                    <CgClose fontSize={16} color="#9099A8" />
                  </button>
                </div>

                <div className="w-full h-[4px] mt-2 rounded-full flex items-center bg-ashShade-3">
                  <p className="w-[45%] h-[4px] bg-bblue rounded-full"></p>
                  <p className="w-[55%] h-[4px] bg-ashShade-3 rounded-r-full"></p>
                </div>
                <progress
                  value={progress}
                  max="100"
                  className="w-full h-[4px] mt-1 bg-ashShade-3 rounded-full border border-red-700">
                  {progress}%
                </progress>
              </div>
            </div>
          )}

          <div className="modal-actions mt-6 flex justify-end gap-x-4">
            <Button onClick={closer} type="secondary" text="Cancel" />
            <Button text={uploading ? 'Uploading' : 'Import file'} />
          </div>
        </div>
      </SuperModal>
    </div>
  );
};

export default UploadFile;
