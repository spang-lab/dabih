
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';

import { FilePlus } from 'react-feather';
import { useDropzone } from 'react-dropzone';
import useTransfers from "@/lib/hooks/transfers";

export default function UploadDialog({ show, cwd, onClose }:
  { show: boolean, cwd: string | null, onClose: () => void }) {

  const upload = useTransfers((state) => state.upload);


  const onFiles = (files: File[]) => {
    if (!cwd) {
      console.error("No current working directory");
      return;
    }
    files.forEach((file) => {
      upload({ file, directory: cwd });
    });
    onClose();
  }



  const {
    getRootProps,
    getInputProps,
    isDragActive,
  } = useDropzone({
    onDrop: onFiles,
    multiple: true,
  });




  const getIcon = () => {
    if (isDragActive) {
      return <FilePlus size={90} className="text-green" />;
    }
    return <FilePlus size={90} className="text-blue" />;
  };


  return (
    <Dialog
      open={show}
      onClose={onClose}
      transition
      className="fixed inset-0 flex w-screen items-center justify-center bg-gray-900/75 p-4 transition duration-300 ease-out data-closed:opacity-0"
    >
      <DialogPanel
        className="w-full max-w-5xl p-6 overflow-hidden text-left align-middle bg-white shadow-xl transform rounded-2xl transition-all"
      >
        <DialogTitle
          as="h2"
          className="text-2xl font-extrabold text-gray-800 leading-6"
        >
          Upload a File
        </DialogTitle>
        <div className="mt-2">
          <div {...getRootProps()} className="bg-gray-400/20 shadow-inner rounded-xl m-2 p-2 justify-center">
            <input {...getInputProps()} />
            <div className="flex justify-center mt-9">
              {getIcon()}
            </div>
            <div className="py-3 flex justify-center">
              <button
                type="button"
                className="px-5 py-3 text-2xl bg-blue rounded-xl text-white"
              >
                Select files to upload
              </button>
            </div>
            <div className="text-center font-thin text-gray-500">
              Drag and drop your file here or click to select a file.
            </div>
          </div>

        </div>
        <div className="text-end">
          <button
            type="button"
            className="mx-3 px-3 py-2 text-white bg-gray-400 rounded-md"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </DialogPanel>
    </Dialog>
  );
}
