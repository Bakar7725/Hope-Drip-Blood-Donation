// DeleteConfirmationModal.jsx
import React, { useState } from 'react';
import { AlertTriangle, Check } from 'lucide-react';

const DeleteConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    userRole = "User"
}) => {
    const [agreed, setAgreed] = useState(false);
    const [understood, setUnderstood] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        if (!agreed || !understood) {
            alert('Please check both checkboxes to proceed');
            return;
        }

        setLoading(true);
        try {
            await onConfirm();
            onClose();
        } catch (error) {
            console.error('Error during deletion:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4">
            <div className="bg-gray-900 rounded-lg w-full max-w-md border border-gray-700 shadow-xl">
                <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-red-900/30 rounded-lg">
                            <AlertTriangle className="w-6 h-6 text-red-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-white">Delete {userRole} Account</h3>
                            <p className="text-gray-400 text-sm">This action cannot be undone</p>
                        </div>
                    </div>

                    {/* Warning Message */}
                    <div className="mb-6 p-4 bg-red-900/20 border border-red-800/50 rounded-lg">
                        <p className="text-red-300 text-sm">
                            ⚠️ <strong>Warning:</strong> You are about to delete your {userRole.toLowerCase()} account data.
                            This will:
                        </p>
                        <ul className="text-red-300 text-sm mt-2 ml-4 list-disc">
                            <li>Set donor/patient status to 0 (not registered)</li>
                            <li>Set verification status to 0 (not verified)</li>
                            <li>Remove all personal information (blood group, age, address, etc.)</li>
                            <li>Keep your login credentials (username, email, password, name)</li>
                        </ul>
                    </div>

                    {/* What will be deleted
                    <div className="mb-6">
                        <h4 className="text-gray-300 font-medium mb-2">What will be deleted:</h4>
                        <ul className="text-sm text-gray-400 space-y-1 mb-4">
                            <li className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-green-400" />
                                Donor status (will become 0)
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-green-400" />
                                Patient status (will become 0)
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-green-400" />
                                Verification status (will become 0)
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-green-400" />
                                Blood group information
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-green-400" />
                                Personal details (age, gender, address)
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-green-400" />
                                Location information (province, city)
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-green-400" />
                                Medical information (if patient)
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-green-400" />
                                Hospital and doctor details
                            </li>
                        </ul>

                        <h4 className="text-gray-300 font-medium mb-2">What will be kept:</h4>
                        <ul className="text-sm text-gray-400 space-y-1">
                            <li className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-blue-400" />
                                Username
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-blue-400" />
                                Email
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-blue-400" />
                                Password (for login)
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-blue-400" />
                                Name (display name)
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-blue-400" />
                                Account ID
                            </li>
                        </ul>
                    </div> */}

                    {/* Checkboxes */}
                    <div className="space-y-3 mb-6">
                        <div className="flex items-start gap-3">
                            <input
                                type="checkbox"
                                id="agree"
                                checked={agreed}
                                onChange={(e) => setAgreed(e.target.checked)}
                                className="mt-1 w-4 h-4 text-red-500 bg-gray-800 border-gray-600 rounded focus:ring-red-600 focus:ring-offset-gray-900"
                            />
                            <label htmlFor="agree" className="text-sm text-gray-300">
                                I understand that this action is permanent and cannot be undone.
                                All my personal data will be deleted except my login credentials.
                            </label>
                        </div>

                        <div className="flex items-start gap-3">
                            <input
                                type="checkbox"
                                id="understand"
                                checked={understood}
                                onChange={(e) => setUnderstood(e.target.checked)}
                                className="mt-1 w-4 h-4 text-red-500 bg-gray-800 border-gray-600 rounded focus:ring-red-600 focus:ring-offset-gray-900"
                            />
                            <label htmlFor="understand" className="text-sm text-gray-300">
                                I understand that I will need to re-register as a donor/patient
                                if I want to use those features again in the future.
                            </label>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1 py-2.5 px-4 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={loading || !agreed || !understood}
                            className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Deleting...
                                </>
                            ) : (
                                'Delete Account Data'
                            )}
                        </button>
                    </div>

                    {/* Footer note */}
                    <p className="text-xs text-gray-500 text-center mt-4">
                        Your account will remain active for login. Only donor/patient data will be removed.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;