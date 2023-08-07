import { Dialog } from '@headlessui/react';

export default function Destroy({ ctx, closeDialog }) {
  const { onSubmit, type, name } = ctx;

  const submit = () => {
    if (onSubmit) {
      onSubmit();
    }
    closeDialog();
  };

  return (
    <Dialog.Panel className="w-full max-w-md p-6 overflow-hidden text-left align-middle shadow-xl transform rounded-2xl transition-all border bg-gray-50 border-gray-300">
      <Dialog.Title
        as="h2"
        className="text-2xl font-extrabold text-gray-800 leading-6"
      >
        Confirm
        <span className="pl-2 text-red">
          Destroy
        </span>
      </Dialog.Title>
      <div className="pt-2">
        Are you sure you want to destroy the
        {' '}
        <span className="font-semibold text-blue">{type}</span>
      </div>
      <div className="py-2 font-semibold text-blue">
        {name}
      </div>
      <div className="pt-2 text-xl text-center text-red font-bold pb-4">
        This action is irreversible.
      </div>

      <div className=" text-right">
        <button
          type="button"
          className="mx-3 px-2 py-1 text-gray-100 bg-red hover:text-white rounded-md"
          onClick={submit}
        >
          Destroy
        </button>
        <button
          type="button"
          className="mx-3 px-2 py-1 text-white bg-gray-400 hover:text-white rounded-md"
          onClick={closeDialog}
        >
          Cancel
        </button>
      </div>
    </Dialog.Panel>
  );
}
