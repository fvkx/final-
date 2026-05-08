import React, { useEffect, useState } from 'react';
import { inquiriesApi } from '../../lib/adminApi';
import { Trash2, CheckCircle, MailOpen, Eye } from 'lucide-react';

interface Inquiry {
  id: number;
  full_name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  date_submitted: string;
}

export function Inquiries() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [filter, setFilter] = useState('all');

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const res = await inquiriesApi.getAll(1, { status: filter, search: '' });
      if (res.success) setInquiries(res.data);
    } catch (error) {
      console.error('Failed to fetch inquiries', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, [filter]);

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await inquiriesApi.updateStatus(id, status);
      fetchInquiries();
      if (selectedInquiry && selectedInquiry.id === id) {
        setSelectedInquiry({ ...selectedInquiry, status });
      }
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this inquiry?')) {
      try {
        await inquiriesApi.delete(id);
        if (selectedInquiry?.id === id) setSelectedInquiry(null);
        fetchInquiries();
      } catch (error) {
        alert('Failed to delete inquiry');
      }
    }
  };

  const openInquiry = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    if (inquiry.status === 'unread') {
      handleStatusChange(inquiry.id, 'read');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Inquiries Management</h1>
        <div className="flex space-x-2">
          {['all', 'unread', 'read', 'replied'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                filter === status 
                  ? 'bg-emerald-100 text-emerald-800' 
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 font-semibold text-gray-600">Sender</th>
              <th className="px-6 py-4 font-semibold text-gray-600">Subject</th>
              <th className="px-6 py-4 font-semibold text-gray-600">Status</th>
              <th className="px-6 py-4 font-semibold text-gray-600">Date</th>
              <th className="px-6 py-4 font-semibold text-gray-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {inquiries.map((inquiry) => (
              <tr key={inquiry.id} className={`hover:bg-gray-50 ${inquiry.status === 'unread' ? 'bg-emerald-50/30' : ''}`}>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{inquiry.full_name}</div>
                  <div className="text-sm text-gray-500">{inquiry.email}</div>
                </td>
                <td className="px-6 py-4 text-gray-800 line-clamp-1">{inquiry.subject}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                    inquiry.status === 'unread' ? 'bg-rose-100 text-rose-800' :
                    inquiry.status === 'read' ? 'bg-blue-100 text-blue-800' :
                    'bg-emerald-100 text-emerald-800'
                  }`}>
                    {inquiry.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500 text-sm">
                  {new Date(inquiry.date_submitted).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button
                    onClick={() => openInquiry(inquiry)}
                    className="text-blue-500 hover:text-blue-700 transition-colors p-1"
                    title="View"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(inquiry.id)}
                    className="text-red-500 hover:text-red-700 transition-colors p-1"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
            {inquiries.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  No inquiries found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedInquiry && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selectedInquiry.subject}</h2>
                <p className="text-sm text-gray-500">From: {selectedInquiry.full_name} ({selectedInquiry.email})</p>
                <p className="text-sm text-gray-500">Date: {new Date(selectedInquiry.date_submitted).toLocaleString()}</p>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                selectedInquiry.status === 'unread' ? 'bg-rose-100 text-rose-800' :
                selectedInquiry.status === 'read' ? 'bg-blue-100 text-blue-800' :
                'bg-emerald-100 text-emerald-800'
              }`}>
                {selectedInquiry.status}
              </span>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-8 whitespace-pre-wrap text-gray-800">
              {selectedInquiry.message}
            </div>

            <div className="flex justify-between items-center border-t border-gray-100 pt-4">
              <div className="space-x-2">
                {selectedInquiry.status !== 'replied' && (
                  <button
                    onClick={() => handleStatusChange(selectedInquiry.id, 'replied')}
                    className="flex items-center space-x-2 px-4 py-2 bg-emerald-100 text-emerald-800 rounded-lg hover:bg-emerald-200"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Mark as Replied</span>
                  </button>
                )}
                {selectedInquiry.status === 'unread' && (
                  <button
                    onClick={() => handleStatusChange(selectedInquiry.id, 'read')}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200"
                  >
                    <MailOpen className="w-4 h-4" />
                    <span>Mark as Read</span>
                  </button>
                )}
              </div>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
