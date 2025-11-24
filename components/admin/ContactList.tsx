"use client";

import { useState } from "react";
import type { ContactSubmission } from "@/types";

interface ContactListProps {
  contacts: ContactSubmission[];
  onStatusChange: (id: string, status: ContactSubmission["status"]) => void;
  onDelete: (id: string) => void;
  onExport?: () => void;
}

export default function ContactList({
  contacts,
  onStatusChange,
  onDelete,
  onExport,
}: ContactListProps) {
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "new" | "read" | "replied">("all");

  const filteredContacts = contacts.filter((contact) => {
    if (filter === "all") return true;
    return contact.status === filter;
  });

  const getStatusColor = (status: ContactSubmission["status"]) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800";
      case "read":
        return "bg-gray-100 text-gray-800";
      case "replied":
        return "bg-green-100 text-green-800";
      case "archived":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          {(["all", "new", "read", "replied"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === f
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)} ({f === "all" ? contacts.length : contacts.filter((c) => c.status === f).length})
            </button>
          ))}
        </div>
        {onExport && (
          <button
            onClick={onExport}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
          >
            Export CSV
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
        {filteredContacts.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No contacts found</div>
        ) : (
          filteredContacts.map((contact) => (
            <div
              key={contact.id}
              className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                selectedContact === contact.id ? "bg-purple-50" : ""
              }`}
              onClick={() => setSelectedContact(selectedContact === contact.id ? null : contact.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(contact.status)}`}>
                      {contact.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{contact.email}</p>
                  {contact.phone && (
                    <p className="text-sm text-gray-600">{contact.phone}</p>
                  )}
                  {contact.subject && (
                    <p className="text-sm font-medium text-gray-900 mt-1">{contact.subject}</p>
                  )}
                  {selectedContact === contact.id && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{contact.message}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        Received: {new Date(contact.created_at).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  <select
                    value={contact.status}
                    onChange={(e) => onStatusChange(contact.id, e.target.value as ContactSubmission["status"])}
                    onClick={(e) => e.stopPropagation()}
                    className="text-xs border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="new">New</option>
                    <option value="read">Read</option>
                    <option value="replied">Replied</option>
                    <option value="archived">Archived</option>
                  </select>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm("Delete this contact?")) {
                        onDelete(contact.id);
                      }
                    }}
                    className="px-3 py-1 text-xs bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

