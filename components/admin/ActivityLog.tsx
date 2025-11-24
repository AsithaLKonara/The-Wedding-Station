"use client";

import type { ActivityLog } from "@/types";

interface ActivityLogProps {
  logs: ActivityLog[];
  limit?: number;
}

export default function ActivityLogComponent({ logs, limit = 50 }: ActivityLogProps) {
  const displayLogs = logs.slice(0, limit);

  const getActionColor = (action: string) => {
    if (action.includes("create") || action.includes("add")) return "text-green-600";
    if (action.includes("delete") || action.includes("remove")) return "text-red-600";
    if (action.includes("update") || action.includes("edit")) return "text-blue-600";
    return "text-gray-600";
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">Recent Activity</h3>
      </div>
      <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
        {displayLogs.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No activity logs</div>
        ) : (
          displayLogs.map((log) => (
            <div key={log.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`font-medium ${getActionColor(log.action)}`}>
                      {log.action}
                    </span>
                    <span className="text-sm text-gray-500">by {log.username}</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {log.resource_type}
                    {log.resource_id && ` (${log.resource_id})`}
                  </p>
                  {log.details && Object.keys(log.details).length > 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      {JSON.stringify(log.details, null, 2)}
                    </p>
                  )}
                </div>
                <span className="text-xs text-gray-400 ml-4">
                  {new Date(log.timestamp).toLocaleString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

