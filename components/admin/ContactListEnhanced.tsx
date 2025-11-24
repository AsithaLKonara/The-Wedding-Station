"use client";

import { useState, useMemo } from "react";
import SearchFilter from "./SearchFilter";
import LoadingSkeleton from "./LoadingSkeleton";
import type { ContactSubmission } from "@/types";

interface ContactListEnhancedProps {
  contacts: ContactSubmission[];
  onStatusChange: (id: string, status: ContactSubmission["status"]) => void;
  onDelete: (id: string) => void;
  onExport: () => void;
  onBulkAction?: (action: string, ids: string[]) => void;
}

export default function ContactListEnhanced({
  contacts,
  onStatusChange,
  onDelete,
  onExport,
  onBulkAction,
}: ContactListEnhancedProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Filter and search contacts
  const filteredContacts = useMemo(() => {
    let filtered = contacts;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (contact) =>
          contact.name?.toLowerCase().includes(query) ||
          contact.email?.toLowerCase().includes(query) ||
          contact.message?.toLowerCase().includes(query) ||
          contact.subject?.toLowerCase().includes(query)
      );
    }

    // Apply filters
    if (filters.status) {
      filtered = filtered.filter((contact) => contact.status === filters.status);
    }
    if (filters.dateFrom) {
      filtered = filtered.filter(
        (contact) => new Date(contact.created_at) >= new Date(filters.dateFrom)
      );
    }
    if (filters.dateTo) {
      filtered = filtered.filter(
        (contact) => new Date(contact.created_at) <= new Date(filters.dateTo)
      );
    }

    return filtered;
  }, [contacts, searchQuery, filters]);

  const handleBulkDelete = async () => {
    if (selectedContacts.length === 0) return;
    if (!confirm(`Delete ${selectedContacts.length} selected contacts?`)) return;

    setIsLoading(true);
    try {
      for (const id of selectedContacts) {
        onDelete(id);
      }
      setSelectedContacts([]);
    } catch (error) {
      console.error("Error bulk deleting:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkStatusChange = async (status: ContactSubmission["status"]) => {
    if (selectedContacts.length === 0) return;

    setIsLoading(true);
    try {
      for (const id of selectedContacts) {
        onStatusChange(id, status);
      }
      setSelectedContacts([]);
    } catch (error) {
      console.error("Error bulk updating status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const statusOptions = [
    { value: "new", label: "New" },
    { value: "read", label: "Read" },
    { value: "replied", label: "Replied" },
    { value: "archived", label: "Archived" },
  ];

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <SearchFilter
          onSearch={setSearchQuery}
          onFilter={setFilters}
          placeholder="Search contacts by name, email, or message..."
          filterOptions={[
            {
              label: "Status",
              key: "status",
              type: "select",
              options: statusOptions,
            },
            {
              label: "Date From",
              key: "dateFrom",
              type: "date",
            },
            {
              label: "Date To",
              key: "dateTo",
              type: "date",
            },
          ]}
        />
      </div>

      {/* Bulk Actions */}
      {selectedContacts.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-blue-800">
              {selectedContacts.length} contact(s) selected
            </span>
            <div className="flex gap-2">
              <select
                onChange={(e) => handleBulkStatusChange(e.target.value as ContactSubmission["status"])}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                disabled={isLoading}
              >
                <option value="">Change Status</option>
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    Mark as {opt.label}
                  </option>
                ))}
              </select>
              <button
                onClick={handleBulkDelete}
                disabled={isLoading}
                className="px-4 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 text-sm"
              >
                {isLoading ? "Deleting..." : "Delete Selected"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Actions Bar */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Showing {filteredContacts.length} of {contacts.length} contacts
        </div>
        <button
          onClick={onExport}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
        >
          Export CSV
        </button>
      </div>

      {/* Contacts List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {isLoading ? (
          <LoadingSkeleton variant="list" count={5} className="p-4" />
        ) : filteredContacts.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No contacts found</p>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredContacts.map((contact) => (
              <div
                key={contact.id}
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <input
                    type="checkbox"
                    checked={selectedContacts.includes(contact.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedContacts([...selectedContacts, contact.id]);
                      } else {
                        setSelectedContacts(selectedContacts.filter((id) => id !== contact.id));
                      }
                    }}
                    className="mt-1 w-4 h-4"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900">{contact.name}</h4>
                        <p className="text-sm text-gray-600">{contact.email}</p>
                        {contact.phone && (
                          <p className="text-sm text-gray-600">{contact.phone}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <select
                          value={contact.status || "new"}
                          onChange={(e) =>
                            onStatusChange(contact.id, e.target.value as ContactSubmission["status"])
                          }
                          className="px-3 py-1 text-xs border border-gray-300 rounded"
                        >
                          {statusOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => onDelete(contact.id)}
                          className="px-3 py-1 text-xs bg-red-50 text-red-600 rounded hover:bg-red-100"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    {contact.subject && (
                      <p className="mt-2 text-sm font-medium text-gray-900">
                        Subject: {contact.subject}
                      </p>
                    )}
                    <p className="mt-2 text-sm text-gray-700">{contact.message}</p>
                    <p className="mt-2 text-xs text-gray-500">
                      {new Date(contact.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

