function ConfirmationModel({
  label,
  actionText,
  classname ="",
  isConfirmationModelOpen,
  submitAction,
}: {
    label: string;
    actionText? : string;
    classname? : string;
    isConfirmationModelOpen: (x: boolean) => void;
    submitAction: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
      />
      <div className="relative w-full max-w-md p-6 mx-auto bg-white rounded-2xl shadow-2xl transform transition-all">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900">Confirm Action</h3>
          <p className="mt-2 text-sm text-gray-500">
            {label}
          </p>
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => isConfirmationModelOpen(false)}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors focus:ring-4 focus:ring-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={submitAction}
            className={`flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors focus:ring-4 focus:ring-red-300 shadow-md ${classname}`}
          >
            Confirm {actionText!=null ? actionText : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModel;