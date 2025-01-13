import React, { useState, useEffect } from 'react';
import { Modal } from '../../components/Modal';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { ImagePlus } from 'lucide-react';
import type { Pharmacy } from '../../types';

interface EditPharmacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  pharmacy: Pharmacy | null;
  onSave: (pharmacy: Pharmacy) => void;
}

export function EditPharmacyModal({ isOpen, onClose, pharmacy, onSave }: EditPharmacyModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Pharmacy>({
    id: '',
    name: '',
    address: '',
    phone: '',
    email: '',
    isOnGard: false,
    image: '',
  });

  useEffect(() => {
    if (pharmacy) {
      setFormData(pharmacy);
    }
  }, [pharmacy]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Failed to update pharmacy:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Pharmacy">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pharmacy Image
          </label>
          <div className="flex items-center space-x-4">
            {formData.image ? (
              <div className="relative">
                <img
                  src={formData.image}
                  alt="Pharmacy preview"
                  className="h-32 w-32 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, image: '' })}
                  className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full p-1 hover:bg-red-200"
                >
                  ×
                </button>
              </div>
            ) : (
              <div className="flex justify-center items-center h-32 w-32 border-2 border-dashed border-gray-300 rounded-lg">
                <div className="text-center">
                  <ImagePlus className="mx-auto h-8 w-8 text-gray-400" />
                  <span className="mt-2 block text-sm font-medium text-gray-600">
                    Add Image
                  </span>
                </div>
                <input
                  type="url"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  placeholder="Enter image URL"
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                />
              </div>
            )}
          </div>
        </div>

        <Input
          label="Pharmacy Name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />

        <Input
          label="Address"
          required
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
        />

        <Input
          label="Phone Number"
          required
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />

        <Input
          label="Email"
          type="email"
          value={formData.email || ''}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="editIsOnGard"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            checked={formData.isOnGard}
            onChange={(e) => setFormData({ ...formData, isOnGard: e.target.checked })}
          />
          <label htmlFor="editIsOnGard" className="text-sm font-medium text-gray-700">
            Open on weekends for emergency services
          </label>
        </div>

        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={isLoading}
          >
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
}