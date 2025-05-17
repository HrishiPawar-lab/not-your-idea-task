import React from "react";
import { useGetAuditLogs } from "./service";
import LogTable from "./LogTable";
const AuditLog = () => {
    const { data } = useGetAuditLogs();

    console.log("data", data);

    return (
        <div className="p-10">
            <h2 className="text-2xl text-orange-600 font-bold mb-3">Audit Logs</h2>
            <LogTable
                logs={Array.isArray(data?.data) && data?.data.length > 0 ? data.data : []}
            />
        </div>
    );
};

export default AuditLog;
