function Modal({
    title = "",
    subTitle ="",
    isOpen,
    closeModal,
    children
}:{
    title : string,
    subTitle:string,
    isOpen : boolean,
    closeModal : ()=>void,
    children: React.ReactNode
}){
    if(!isOpen) return null;
    return(
    <div className="fixed inset-0 z-100 flex justify-center items-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
        <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in duration-300">
            <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
            <div>
                <h2 className="text-xl font-bold text-slate-800">{title}</h2>
                <p className="text-slate-500 text-sm">{subTitle}</p>
            </div>
            <button onClick={closeModal} className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-all">✕</button>
        </div>
        {children}
        </div>
    </div>
    )
};

export default Modal;