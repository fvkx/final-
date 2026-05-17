import React, { createContext, useContext, useState } from 'react';
import { X, CheckCircle, AlertTriangle, Info, AlertOctagon } from 'lucide-react';

interface ToastState {
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ConfirmState {
  show: boolean;
  title: string;
  message: string;
  resolve?: (value: boolean) => void;
}

interface NotificationContextType {
  toast: (message: string, type?: 'success' | 'error' | 'info') => void;
  confirm: (title: string, message: string) => Promise<boolean>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [toastState, setToastState] = useState<ToastState>({ show: false, message: '', type: 'success' });
  const [confirmState, setConfirmState] = useState<ConfirmState>({ show: false, title: '', message: '' });

  const toast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastState({ show: true, message, type });
    setTimeout(() => {
      setToastState((prev) => (prev.message === message ? { ...prev, show: false } : prev));
    }, 4000);
  };

  const confirm = (title: string, message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setConfirmState({
        show: true,
        title,
        message,
        resolve,
      });
    });
  };

  const handleConfirmClose = (confirmed: boolean) => {
    if (confirmState.resolve) {
      confirmState.resolve(confirmed);
    }
    setConfirmState({ show: false, title: '', message: '' });
  };

  return (
    <NotificationContext.Provider value={{ toast, confirm }}>
      {children}

      {/* Toast Notification */}
      {toastState.show && (
        <div className="fixed bottom-6 right-6 z-[999] max-w-sm w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-4 flex items-start gap-3 animate-toast">
          <div className="flex-shrink-0 mt-0.5">
            {toastState.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-500" />}
            {toastState.type === 'error' && <AlertOctagon className="w-5 h-5 text-rose-500" />}
            {toastState.type === 'info' && <Info className="w-5 h-5 text-blue-500" />}
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold text-gray-900 capitalize">{toastState.type}</p>
            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{toastState.message}</p>
          </div>
          <button 
            onClick={() => setToastState({ ...toastState, show: false })}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 p-0.5 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmState.show && (
        <div className="fixed inset-0 z-[998] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" 
            onClick={() => handleConfirmClose(false)} 
          />
          <div className="relative bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl animate-modal text-center flex flex-col items-center">
            <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">{confirmState.title}</h3>
            <p className="text-xs text-gray-500 leading-relaxed mb-6">{confirmState.message}</p>
            <div className="flex gap-3 w-full">
              <button
                onClick={() => handleConfirmClose(false)}
                className="flex-1 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold rounded-xl text-xs transition-all border border-gray-200/60"
              >
                Cancel
              </button>
              <button
                onClick={() => handleConfirmClose(true)}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-all shadow-sm shadow-emerald-600/10"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  );
}
