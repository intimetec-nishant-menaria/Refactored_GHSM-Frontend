function Modal({
    title = "",
    subTitle ="",
    isOpen,
    closeModal,
    children
}:{
    title : string,
    subTitle?:string,
    isOpen : boolean,
    closeModal : ()=>void,
    children: React.ReactNode
}){
    if(!isOpen) return null;
    
    return(
    <div className="fixed inset-0 z-100 flex justify-center items-center bg-text-main/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
        <div className="relative w-full max-w-2xl bg-surface rounded-[2rem] shadow-2xl border border-border overflow-hidden animate-in zoom-in duration-300">
            <div className="p-6 bg-layout/30 border-b border-muted flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-black text-text-main tracking-tight">{title}</h2>
                    {subTitle && (
                        <p className="text-text-muted text-sm font-medium">{subTitle}</p>
                    )}
                </div>
                <button 
                    onClick={closeModal} 
                    className="p-2 hover:bg-muted rounded-full text-text-muted hover:text-text-main transition-all font-bold"
                >
                    ✕
                </button>
            </div>

            <div className="relative">
                {children}
            </div>
        </div>
    </div>
    )
};

export default Modal;