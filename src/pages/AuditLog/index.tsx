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
    },{
        refetchOnMountOrArgChange : true
    });

    if (isLoading) return <div className="p-10 text-center">Initial Load...</div>;
    if (isError) return <div className="p-10 text-center text-red-500">Failed to fetch logs.</div>;

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col gap-2">
                <button onClick={() => navigate(-1)} className="text-blue-600 hover:underline w-fit">
                    &larr; Back to Management
                </button>
                <h1 className="text-2xl font-bold text-gray-800">
                    Audit Logs: {entityName} <span className="text-blue-500">#{entityId}</span>
                </h1>
            </div>

            <div className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-auto ${isFetching ? 'opacity-50' : ''}`}>
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="p-4 font-semibold text-gray-700">User</th>
                            <th className="p-4 font-semibold text-gray-700">Action</th>
                            <th className="p-4 font-semibold text-gray-700">Changes</th>
                            <th className="p-4 font-semibold text-gray-700">Updated At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.data.map((log, index) => (
                            <AuditRow key={index} log={log} />
                        ))}
                        {data?.data.length === 0 && (
                            <tr>
                                <td colSpan={4} className="p-10 text-center text-gray-400 italic">
                                    No history found for this record.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {data && data.metaData.totalCount > 0 && (
                <div className="mt-6 bg-white p-4 rounded-lg shadow-sm border">
                    <PagingController
                        dataLength={data.metaData.totalCount}
                        currentPage={currentPage}
                        itemPerPage={itemPerPage}
                        goToPrevious={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        goToNext={() => setCurrentPage(prev => prev + 1)}
                        goToSpecificPage={(page:number) => setCurrentPage(page)}
                    />
                </div>
            )}
        </div>
    );
};

const AuditRow = ({ log }: { log: any }) => {
    const oldVals = JSON.parse(log.oldValue || "{}");
    const newVals = JSON.parse(log.newValue || "{}");

    const blacklist = ["HashPassword", "createdAt", "updatedAt", "id", "hashPassword"];

    const changedKeys = Object.keys(newVals).filter(key => {
        const isBlacklisted = blacklist.includes(key);
        const hasChanged = JSON.stringify(oldVals[key]) !== JSON.stringify(newVals[key]);
        
        return !isBlacklisted && hasChanged;
    });

    return (
        <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
            <td className="p-4">
                <p className="font-medium text-gray-900">{log.userName}</p>
                <p className="text-xs text-gray-500">{log.userEmail}</p>
            </td>
            <td className="p-4">
                <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                    log.action === 'CREATE' ? 'bg-green-100 text-green-700' : 
                    log.action === 'UPDATE' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                }`}>
                    {log.action}
                </span>
            </td>
            <td className="p-4 text-sm max-w-md">
                {changedKeys.length > 0 ? changedKeys.map(key => (
                    <div key={key} className="mb-2 last:mb-0">
                        <span className="text-[10px] font-bold text-gray-400 uppercase block">{key}</span>
                        <div className="flex items-center gap-2">
                            {log.action !== "CREATE" && (
                                <>
                                    <span className="text-red-400 line-through truncate max-w-[120px]">
                                        {oldVals[key] === null || oldVals[key] === undefined ? 'null' : String(oldVals[key])}
                                    </span>
                                    <span className="text-gray-300">&rarr;</span>
                                </>
                            )}
                            <span className="text-green-600 font-semibold">{String(newVals[key])}</span>
                        </div>
                    </div>
                )) : (
                    <span className="text-gray-400 italic text-xs">
                        {log.action === "DELETE" ? "Record Removed" : "No displayable changes"}
                    </span>
                )}
            </td>
            <td className="p-4 text-sm text-gray-500">
                {new Date(log.timestamp).toLocaleString()}
            </td>
        </tr>
    );
};

export default AuditLogPage;