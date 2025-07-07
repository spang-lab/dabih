
import { DialogTransition } from "./Transition";
import { DialogTitle, DialogPanel } from "@headlessui/react";

export default function DeleteDialog({
  show,
  type,
  name,
  onSubmit,
  onClose,
}:
  {
    type: string,
    name: string,
    onSubmit: () => void,
    show: boolean,
    onClose: () => void
  }
) {
  return (
    <DialogTransition show={show} onClose={onClose}>
      <DialogPanel className="w-full max-w-md p-6 overflow-hidden text-left align-middle shadow-xl transform rounded-2xl transition-all border bg-gray-50 border-gray-300">
        <DialogTitle
          as="h2"
          className="text-2xl font-extrabold text-gray-800 leading-6"
        >
          Confirm
          <span className="pl-2 text-red">
            Deletion
          </span>
        </DialogTitle>
        <div className="pt-2">
          Are you sure you want to delete the
          {' '}
          <span className="font-semibold text-blue">{type}</span>
        </div>
        <div className="py-2 font-semibold text-blue">
          {name}
        </div>

        <div className="text-right">
          <button
            type="button"
            className="mx-3 px-2 py-1 text-gray-100 bg-red hover:text-white rounded-md"
            onClick={() => {
              onSubmit();
              onClose();
            }}
          >
            Delete
          </button>
          <button
            type="button"
            className="mx-3 px-2 py-1 text-white bg-gray-400 hover:text-white rounded-md"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </DialogPanel>
    </DialogTransition>
  );
}



