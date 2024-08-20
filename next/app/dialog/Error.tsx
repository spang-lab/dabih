
import { DialogTransition } from "./Transition";
import { DialogTitle, DialogPanel } from "@headlessui/react";
import Link from "next/link";

export default function ErrorDialog({
  message,
  onClose,
}:
  {
    message: string | null,
    onClose: () => void,
  }
) {
  return (
    <DialogTransition show={!!message} onClose={onClose}>
      <DialogPanel className="w-full max-w-xl p-6 overflow-hidden text-left align-middle bg-white shadow-xl transform rounded-2xl transition-all">
        <DialogTitle
          as="h2"
          className="text-2xl font-extrabold text-red leading-6"
        >
          Error
        </DialogTitle>
        <div className="mt-2">
          <p className="text-gray-600">Dabih encountered an Error</p>
          <p className="font-semibold text-red my-3">{message}</p>
          <p className="text-gray-600">For help please contact an admin</p>
          <Link href="/docs/contact" className="text-lg text-blue hover:underline font-bold">Contact Page</Link>
        </div>

        <div className="mt-4 text-right">
          <button
            type="button"
            onClick={onClose}
            className="mx-3 px-3 py-2 rounded bg-gray-500 text-gray-100 hover:text-white"
          >
            Ok
          </button>
        </div>
      </DialogPanel>
    </DialogTransition>
  );
}
