function ConfirmationModel({
  label,
  actionText,
  classname = "",
  isConfirmationModelOpen,
  submitAction,
}: {
  label: string;
  actionText?: string;
  classname?: string;
  isConfirmationModelOpen: (x: boolean) => void;
  submitAction: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 outline-none focus:outline-none transition-all">
      <div 
        className="fixed inset-0 bg-text-main/40 backdrop-blur-sm transition-opacity" 
        onClick={() => isConfirmationModelOpen(false)}
      />
      
      <div className="relative w-full max-w-md p-8 mx-auto bg-surface rounded-[2rem] shadow-2xl border border-border transform transition-all animate-in zoom-in duration-200">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-danger/10 mb-4">
            <span className="text-danger text-xl font-bold">!</span>
          </div>
          
          <h3 className="text-xl font-black text-text-main tracking-tight">
            Confirm Action
          </h3>
          <p className="mt-3 text-sm font-medium text-text-muted leading-relaxed">
            {label}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-8">
          <button
            onClick={() => isConfirmationModelOpen(false)}
            className="flex-1 px-4 py-3 text-xs font-black uppercase tracking-widest text-text-muted bg-muted rounded-xl hover:bg-border transition-all active:scale-95"
          >
            Cancel
          </button>
          <button
            onClick={submitAction}
            className={`flex-1 px-4 py-3 text-xs font-black uppercase tracking-widest text-surface bg-danger rounded-xl hover:bg-danger-hover transition-all shadow-lg shadow-danger/20 active:scale-95 ${classname}`}
          >
             {actionText ? actionText : "Confirm Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModel;