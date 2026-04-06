import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useFetchAuditLogQuery } from "@/app/Api's/auditLog";
import PagingController from "@/components/common/paging/PagingController";

const AuditLogPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const entityName = searchParams.get("entityName") || "";
    const entityId = searchParams.get("entityId") || "";

    const [currentPage, setCurrentPage] = useState(1);
    const itemPerPage = 10;

    const { data, isLoading, isFetching, isError } = useFetchAuditLogQuery({
        pageSize: itemPerPage,
        currentPage: currentPage,
        entityName: entityName,
        id: entityId
    }, {
        refetchOnMountOrArgChange: true
    });

    if (isLoading) return (
        <div className="py-32 text-center bg-layout min-h-screen">
            <div className="animate-bounce text-primary font-black text-2xl">...</div>
        </div>
    );
    
    if (isError) return (
        <div className="p-10 text-center text-danger bg-layout min-h-screen font-bold">
            Failed to fetch audit history.
        </div>
    );

    return (
        <div className="p-4 md:p-8 min-h-screen w-full font-sans bg-layout">
            <div className="flex flex-col gap-4 mb-8">
                <button 
                    onClick={() => navigate(-1)} 
                    className="flex items-center gap-2 text-primary font-bold text-sm hover:underline w-fit"
                >
                    &larr; Back to Management
                </button>
                <div>
                    <h1 className="text-2xl font-black text-text-main tracking-tight">
                        Audit Logs: <span className="text-text-muted">{entityName}</span> 
                        <span className="ml-2 text-primary bg-primary/10 px-3 py-1 rounded-lg">#{entityId}</span>
                    </h1>
                    <p className="text-text-muted text-sm mt-1">Detailed history of changes and user actions</p>
                </div>
            </div>
            <div className={`bg-surface rounded-3xl shadow-sm border border-border overflow-hidden transition-opacity ${isFetching ? 'opacity-50' : 'opacity-100'}`}>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse table-auto">
                        <thead className="bg-muted text-text-muted border-b border-border text-[10px] uppercase font-bold tracking-widest">
                            <tr>
                                <th className="py-5 px-8 whitespace-nowrap">Authorized User</th>
                                <th className="py-5 px-8 whitespace-nowrap">Action Type</th>
                                <th className="py-5 px-8 whitespace-nowrap">Value Modifications</th>
                                <th className="py-5 px-8 whitespace-nowrap">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-muted">
                            {data?.data.map((log, index) => (
                                <AuditRow key={index} log={log} />
                            ))}
                            {data?.data.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="py-20 text-center text-text-muted italic text-sm">
                                        No historical records found for this entity.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {data && data.metaData.totalCount > 0 && (
                <div className="mt-10 flex justify-center">
                    <PagingController
                        dataLength={data.metaData.totalCount}
                        currentPage={currentPage}
                        itemPerPage={itemPerPage}
                        goToPrevious={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        goToNext={() => setCurrentPage(prev => prev + 1)}
                        goToSpecificPage={(page: number) => setCurrentPage(page)}
                    />
                </div>
            )}
        </div>
    );
};

const AuditRow = ({ log }: { log: any }) => {
    const parseJSON = (val: any) => {
        try { return JSON.parse(val || "{}"); } 
        catch { return {}; }
    };

    const oldVals = parseJSON(log.oldValue);
    const newVals = parseJSON(log.newValue);

    const blacklist = ["HashPassword", "createdAt", "updatedAt", "id", "hashPassword", "Password"];

    const changedKeys = Object.keys(newVals).filter(key => {
        const isBlacklisted = blacklist.includes(key);
        const hasChanged = JSON.stringify(oldVals[key]) !== JSON.stringify(newVals[key]);
        return !isBlacklisted && hasChanged;
    });

    return (
        <tr className="hover:bg-primary/5 transition-colors group">
            <td className="py-5 px-8">
                <p className="font-bold text-text-main text-sm group-hover:text-primary transition-colors">{log.userName}</p>
                <p className="text-[11px] text-text-muted font-medium italic">{log.userEmail}</p>
            </td>
            <td className="py-5 px-8">
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter border ${
                    log.action === 'CREATE' ? 'bg-success/10 text-success border-success/20' : 
                    log.action === 'UPDATE' ? 'bg-primary/10 text-primary border-primary/20' : 
                    'bg-danger/10 text-danger border-danger/20'
                }`}>
                    {log.action}
                </span>
            </td>
            <td className="py-5 px-8 text-sm max-w-md">
                <div className="flex flex-col gap-3">
                    {changedKeys.length > 0 ? changedKeys.map(key => (
                        <div key={key} className="bg-layout/30 p-2 rounded-xl border border-border/50">
                            <span className="text-[9px] font-black text-text-muted/60 uppercase tracking-widest block mb-1">
                                {key}
                            </span>
                            <div className="flex items-center gap-2 overflow-hidden">
                                {log.action !== "CREATE" && (
                                    <>
                                        <span className="text-danger text-xs line-through truncate opacity-70">
                                            {oldVals[key] === null ? 'null' : String(oldVals[key])}
                                        </span>
                                        <span className="text-text-muted/40 font-bold">→</span>
                                    </>
                                )}
                                <span className="text-success text-xs font-black truncate">
                                    {String(newVals[key])}
                                </span>
                            </div>
                        </div>
                    )) : (
                        <span className="text-text-muted/50 italic text-xs">
                            {log.action === "DELETE" ? "Record Purged" : "Metadata update only"}
                        </span>
                    )}
                </div>
            </td>
            <td className="py-5 px-8 text-xs font-bold text-text-muted">
                <div className="flex flex-col">
                    <span>{new Date(log.timestamp).toLocaleDateString()}</span>
                    <span className="opacity-60">{new Date(log.timestamp).toLocaleTimeString()}</span>
                </div>
            </td>
        </tr>
    );
};

export default AuditLogPage;