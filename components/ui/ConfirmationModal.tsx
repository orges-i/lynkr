import React, { useEffect, useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { Button } from '../ui/Button';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isDestructive?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    isDestructive = false,
}) => {
    const [visible, setVisible] = useState(false);
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setVisible(true);
            setTimeout(() => setAnimate(true), 10);
        } else {
            setAnimate(false);
            setTimeout(() => setVisible(false), 300);
        }
    }, [isOpen]);

    if (!visible) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${animate ? 'opacity-100' : 'opacity-0'}`}
                onClick={onClose}
            />

            {/* Modal Content */}
            <div
                className={`relative w-full max-w-md bg-surface border border-border rounded-2xl shadow-2xl transform transition-all duration-300 ${animate ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'}`}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full text-secondary hover:text-primary hover:bg-surfaceHighlight transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="p-6">
                    <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4 text-red-500">
                        <AlertTriangle className="w-6 h-6" />
                    </div>

                    <h3 className="text-xl font-bold mb-2">{title}</h3>
                    <p className="text-secondary text-sm leading-relaxed mb-6">
                        {message}
                    </p>

                    <div className="flex gap-3 justify-end">
                        <Button variant="ghost" onClick={onClose} className="px-5">
                            {cancelText}
                        </Button>
                        <Button
                            variant={isDestructive ? 'primary' : 'primary'}
                            onClick={() => { onConfirm(); onClose(); }}
                            className={isDestructive ? 'bg-red-500 hover:bg-red-600 text-white border-none' : ''}
                        >
                            {confirmText}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
