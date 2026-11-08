'use client';

import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  useEffect,
} from 'react';
import {
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Info,
  X,
  Trash2,
  Link2,
} from 'lucide-react';

export type DialogType = 'danger' | 'warning' | 'info' | 'success' | 'error' | 'prompt';

export interface ConfirmOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
  badge?: string;
}

export interface AlertOptions {
  title?: string;
  message: string;
  confirmText?: string;
  type?: 'error' | 'warning' | 'info' | 'success';
  badge?: string;
}

export interface PromptOptions {
  title?: string;
  message: string;
  defaultValue?: string;
  placeholder?: string;
  confirmText?: string;
  cancelText?: string;
  badge?: string;
}

interface DialogState {
  isOpen: boolean;
  mode: 'confirm' | 'alert' | 'prompt';
  type: DialogType;
  title: string;
  message: string;
  badge?: string;
  confirmText: string;
  cancelText: string;
  promptValue?: string;
  placeholder?: string;
}

interface CyberDialogContextType {
  confirm: (options: ConfirmOptions | string) => Promise<boolean>;
  alert: (options: AlertOptions | string) => Promise<void>;
  prompt: (options: PromptOptions | string) => Promise<string | null>;
}

const CyberDialogContext = createContext<CyberDialogContextType | null>(null);

export function CyberDialogProvider({ children }: { children: React.ReactNode }) {
  const [dialog, setDialog] = useState<DialogState>({
    isOpen: false,
    mode: 'confirm',
    type: 'danger',
    title: 'Confirm Action',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    promptValue: '',
  });

  const resolverRef = useRef<((value: any) => void) | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const confirm = useCallback((options: ConfirmOptions | string): Promise<boolean> => {
    return new Promise((resolve) => {
      resolverRef.current = resolve;
      if (typeof options === 'string') {
        setDialog({
          isOpen: true,
          mode: 'confirm',
          type: 'danger',
          title: 'Confirm Action',
          message: options,
          confirmText: 'Delete',
          cancelText: 'Cancel',
          badge: 'SYSTEM CONFIRMATION',
        });
      } else {
        setDialog({
          isOpen: true,
          mode: 'confirm',
          type: options.type || 'danger',
          title: options.title || (options.type === 'danger' ? 'Confirm Deletion' : 'Confirm Action'),
          message: options.message,
          confirmText: options.confirmText || (options.type === 'danger' ? 'Delete' : 'Confirm'),
          cancelText: options.cancelText || 'Cancel',
          badge: options.badge || (options.type === 'danger' ? 'DESTRUCTIVE ACTION' : 'SYSTEM CONFIRMATION'),
        });
      }
    });
  }, []);

  const alert = useCallback((options: AlertOptions | string): Promise<void> => {
    return new Promise((resolve) => {
      resolverRef.current = resolve;
      if (typeof options === 'string') {
        setDialog({
          isOpen: true,
          mode: 'alert',
          type: 'error',
          title: 'System Notice',
          message: options,
          confirmText: 'Acknowledge',
          cancelText: '',
          badge: 'SYSTEM NOTICE',
        });
      } else {
        setDialog({
          isOpen: true,
          mode: 'alert',
          type: options.type || 'info',
          title: options.title || (options.type === 'error' ? 'Action Failed' : 'Notice'),
          message: options.message,
          confirmText: options.confirmText || 'Acknowledge',
          cancelText: '',
          badge: options.badge || (options.type === 'error' ? 'SYSTEM ERROR' : 'NOTICE'),
        });
      }
    });
  }, []);

  const prompt = useCallback((options: PromptOptions | string): Promise<string | null> => {
    return new Promise((resolve) => {
      resolverRef.current = resolve;
      const initialVal = typeof options === 'string' ? '' : options.defaultValue || '';
      if (typeof options === 'string') {
        setDialog({
          isOpen: true,
          mode: 'prompt',
          type: 'prompt',
          title: 'User Input Required',
          message: options,
          confirmText: 'Submit',
          cancelText: 'Cancel',
          promptValue: '',
          badge: 'INPUT REQUIRED',
        });
      } else {
        setDialog({
          isOpen: true,
          mode: 'prompt',
          type: 'prompt',
          title: options.title || 'Input Required',
          message: options.message,
          confirmText: options.confirmText || 'Confirm',
          cancelText: options.cancelText || 'Cancel',
          promptValue: initialVal,
          placeholder: options.placeholder,
          badge: options.badge || 'PROMPT DIALOG',
        });
      }
    });
  }, []);

  // Auto focus input when in prompt mode
  useEffect(() => {
    if (dialog.isOpen && dialog.mode === 'prompt') {
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select();
        }
      }, 50);
    }
  }, [dialog.isOpen, dialog.mode]);

  const handleConfirm = () => {
    const resolver = resolverRef.current;
    resolverRef.current = null;
    if (dialog.mode === 'prompt') {
      resolver?.(dialog.promptValue || '');
    } else if (dialog.mode === 'confirm') {
      resolver?.(true);
    } else {
      resolver?.(undefined);
    }
    setDialog((prev) => ({ ...prev, isOpen: false }));
  };

  const handleCancel = () => {
    const resolver = resolverRef.current;
    resolverRef.current = null;
    if (dialog.mode === 'confirm') {
      resolver?.(false);
    } else if (dialog.mode === 'prompt') {
      resolver?.(null);
    } else {
      resolver?.(undefined);
    }
    setDialog((prev) => ({ ...prev, isOpen: false }));
  };

  // Close on Escape, confirm on Enter
  useEffect(() => {
    if (!dialog.isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCancel();
      } else if (e.key === 'Enter' && dialog.mode !== 'prompt') {
        e.preventDefault();
        handleConfirm();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dialog.isOpen, dialog.mode, dialog.promptValue]);

  // Determine Icon and accent styling based on type
  const renderIcon = () => {
    switch (dialog.type) {
      case 'danger':
        return (
          <div className="w-14 h-14 rounded-2xl bg-[#FF3D00]/15 border border-[#FF3D00]/40 text-[#FF3D00] shadow-[0_0_25px_rgba(255,61,0,0.35)] flex items-center justify-center mx-auto mb-4 animate-in zoom-in-75 duration-200">
            <Trash2 className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
        );
      case 'warning':
        return (
          <div className="w-14 h-14 rounded-2xl bg-[#FF3D00]/15 border border-[#FF3D00]/40 text-[#FF3D00] shadow-[0_0_25px_rgba(255,61,0,0.35)] flex items-center justify-center mx-auto mb-4 animate-in zoom-in-75 duration-200">
            <AlertTriangle className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
        );
      case 'error':
        return (
          <div className="w-14 h-14 rounded-2xl bg-red-500/15 border border-red-500/40 text-red-400 shadow-[0_0_25px_rgba(239,68,68,0.35)] flex items-center justify-center mx-auto mb-4 animate-in zoom-in-75 duration-200">
            <AlertCircle className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
        );
      case 'success':
        return (
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.35)] flex items-center justify-center mx-auto mb-4 animate-in zoom-in-75 duration-200">
            <CheckCircle2 className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
        );
      case 'prompt':
        return (
          <div className="w-14 h-14 rounded-2xl bg-[#FF3D00]/15 border border-[#FF3D00]/40 text-[#FF3D00] shadow-[0_0_25px_rgba(255,61,0,0.35)] flex items-center justify-center mx-auto mb-4 animate-in zoom-in-75 duration-200">
            <Link2 className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
        );
      case 'info':
      default:
        return (
          <div className="w-14 h-14 rounded-2xl bg-[#FF3D00]/15 border border-[#FF3D00]/40 text-[#FF3D00] shadow-[0_0_25px_rgba(255,61,0,0.35)] flex items-center justify-center mx-auto mb-4 animate-in zoom-in-75 duration-200">
            <Info className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
        );
    }
  };

  return (
    <CyberDialogContext.Provider value={{ confirm, alert, prompt }}>
      {children}

      {/* Cyber Modal Overlay */}
      {dialog.isOpen && (
        <div
          className="fixed inset-0 z-[99999] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget && dialog.mode !== 'prompt') {
              handleCancel();
            }
          }}
        >
          {/* Modal Container */}
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-md bg-[#090D18] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(0,0,0,0.95),0_0_35px_rgba(255,61,0,0.25)] relative overflow-hidden text-white cyber-corner animate-in zoom-in-95 duration-200"
          >
            {/* Top Glowing Laser Edge */}
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#FF3D00] to-transparent shadow-[0_0_12px_#FF3D00]" />

            {/* Ambient Background Glow */}
            <div className="w-48 h-48 rounded-full bg-[#FF3D00]/10 blur-3xl absolute -top-12 -right-12 pointer-events-none" />

            {/* Close Button */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleCancel();
              }}
              className="absolute top-3.5 right-3.5 sm:top-5 sm:right-5 z-50 w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/5 hover:bg-white/15 active:bg-white/25 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer border border-white/10 hover:border-white/20 shadow-md group"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
            </button>

            {/* Dialog Content */}
            <div className="text-center relative z-10">
              {renderIcon()}

              {/* Badge */}
              {dialog.badge && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF3D00]/10 border border-[#FF3D00]/30 text-[#FF3D00] text-[10px] font-bold uppercase tracking-wider mb-2.5 font-mono shadow-[0_0_10px_rgba(255,61,0,0.2)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF3D00] animate-pulse" />
                  <span>{dialog.badge}</span>
                </div>
              )}

              {/* Title */}
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight">
                {dialog.title}
              </h3>

              {/* Message */}
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal mt-2.5">
                {dialog.message}
              </p>

              {/* Prompt Input Form */}
              {dialog.mode === 'prompt' && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleConfirm();
                  }}
                  className="mt-4"
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={dialog.promptValue}
                    onChange={(e) =>
                      setDialog((prev) => ({ ...prev, promptValue: e.target.value }))
                    }
                    placeholder={dialog.placeholder || 'Enter value...'}
                    className="w-full px-4 py-3 rounded-xl bg-[#05070B] border border-white/15 focus:border-[#FF3D00] text-white text-xs sm:text-sm outline-none font-mono shadow-inner transition-colors"
                  />
                </form>
              )}

              {/* Action Buttons */}
              <div className="mt-6 flex items-center gap-3">
                {dialog.mode !== 'alert' && (
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 py-3 px-4 rounded-xl bg-[#0E1526] hover:bg-[#152038] text-slate-300 hover:text-white border border-white/10 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200"
                  >
                    {dialog.cancelText || 'Cancel'}
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleConfirm}
                  className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 border ${
                    dialog.type === 'danger'
                      ? 'bg-[#FF3D00] hover:bg-[#eb3800] text-white border-[#FF3D00] shadow-[0_0_25px_rgba(255,61,0,0.5)]'
                      : dialog.type === 'error'
                      ? 'bg-red-600 hover:bg-red-500 text-white border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)]'
                      : 'bg-[#FF3D00] hover:bg-[#eb3800] text-white border-[#FF3D00] shadow-[0_0_25px_rgba(255,61,0,0.5)]'
                  }`}
                >
                  {dialog.type === 'danger' && <Trash2 className="w-4 h-4" />}
                  <span>{dialog.confirmText}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </CyberDialogContext.Provider>
  );
}

export function useCyberDialog() {
  const context = useContext(CyberDialogContext);
  if (!context) {
    throw new Error('useCyberDialog must be used within a CyberDialogProvider');
  }
  return context;
}

