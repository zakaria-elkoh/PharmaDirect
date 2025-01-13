import React, { useState } from 'react';
import { Layout } from './Layout';
import { PharmaciesList } from './PharmaciesList';
import { ChangePasswordModal } from '../../components/ChangePasswordModal';
import { Button } from '../../components/Button';
import { KeyRound } from 'lucide-react';

export function Dashboard() {
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);

  return (
    <Layout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
            <Button
              variant="outline"
              onClick={() => setIsChangePasswordModalOpen(true)}
              className="flex items-center"
            >
              <KeyRound className="w-4 h-4 mr-2" />
              Change Password
            </Button>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="py-4">
            <PharmaciesList />
          </div>
        </div>
      </div>

      <ChangePasswordModal
        isOpen={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
      />
    </Layout>
  );
}