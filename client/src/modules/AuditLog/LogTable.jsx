import React from "react";
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    flexRender,
} from "@tanstack/react-table";
import moment from "moment";

const ActivityLogTable = ({ logs }) => {
    const data = React.useMemo(() => logs, [logs]);
    const columns = React.useMemo(
        () => [
            {
                accessorKey: "user.username",
                header: "User",
                cell: (info) => info.getValue(),
            },
            {
                accessorKey: "task.title",
                header: "Task",
                cell: (info) => info.getValue(),
            },
            {
                accessorKey: "action",
                header: "Action",
                cell: (info) => (
                    <span className="capitalize text-orange-500">{info.getValue()}</span>
                ),
            },
            {
                accessorKey: "changes",
                header: "Changes",
                cell: ({ row }) => {
                    const changes = row?.original?.changes || {};
                    return changes
                        ? Object.entries(changes).map(([key, value]) => {
                            if (Array.isArray(value) && value.length === 2) {
                                const [from, to] = value;
                                return (
                                    <div key={key}>
                                        <span className="font-medium text-gray-600">{key}:</span>{" "}
                                        <span className="text-gray-800">{from?.toString() ?? ""}</span> →{" "}
                                        <span className="text-green-600 font-semibold">
                                            {to?.toString() ?? ""}
                                        </span>
                                    </div>
                                );
                            }

                            return (
                                <div key={key}>
                                    <span className="font-medium text-gray-600">{key}:</span>{" "}
                                    <span className="text-gray-800">{value?.toString() ?? ""}</span>
                                </div>
                            );
                        })
                        : null;
                },
            },
            {
                accessorKey: "timestamp",
                header: "Timestamp",
                cell: (info) => (
                    <span className="text-gray-500">
                        {moment(info.getValue()).format("MMM D, YYYY h:mm A")}
                    </span>
                ),
            },
        ],
        []
    );

    const [pageIndex, setPageIndex] = React.useState(0);

    const table = useReactTable({
        data,
        columns,
        state: {
            pagination: {
                pageIndex,
                pageSize: 10,
            },
        },
        pageCount: Math.ceil(data.length / 20),
        onPaginationChange: (updater) => {
            if (typeof updater === "function") {
                setPageIndex((old) => {
                    const next = updater({ pageIndex: old, pageSize: 20 }).pageIndex;
                    return next;
                });
            } else {
                setPageIndex(updater.pageIndex);
            }
        },
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        manualPagination: false,
    });

    return (
        <div className="space-y-4">
            <div className="overflow-x-auto rounded-lg shadow border border-gray-200 text-gray-700">
                <table className="min-w-full text-sm text-left">
                    <thead className="bg-gray-50">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th className="p-3 font-medium text-gray-600" key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {table.getRowModel().rows.map((row) => (
                            <tr key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <td className="p-3" key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex items-center justify-between px-2 py-2">
                <button
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    className="px-4 py-1 rounded bg-orange-500 text-sm text-white disabled:opacity-50"
                >
                    Prev
                </button>

                <span className="text-sm text-gray-600">
                    Page {pageIndex + 1} of {table.getPageCount()}
                </span>

                <button
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className="px-4 py-1 rounded bg-orange-500 text-sm text-white disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default ActivityLogTable;
