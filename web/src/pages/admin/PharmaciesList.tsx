import React, { useEffect, useState } from "react";
import { Edit, Trash2, MapPin, Mail, Phone } from "lucide-react";
import { Button } from "../../components/Button";
import { EditPharmacyModal } from "./EditPharmacyModal";
import type { Pharmacy } from "../../types";
import { useAppDispatch, useAppSelector } from "@/hook";
import { getAllPharmacy } from "@/store/features/pharmacySlice";

export function PharmaciesList() {
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([
    {
      id: "1",
      name: "Central Pharmacy",
      address: "123 Main St",
      phone: "123-456-7890",
      email: "central@example.com",
      isOnGard: true,
      image:
        "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&q=80&w=400",
    },
    {
      id: "2",
      name: "City Drugstore",
      address: "456 Oak Ave",
      phone: "098-765-4321",
      isOnGard: false,
      image:
        "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&q=80&w=400",
    },
  ]);

  const { pharmacys, counterPharmacy } = useAppSelector((state) => state.phar);
  const dispatch = useAppDispatch();

  console.log(pharmacys);

  const [editingPharmacy, setEditingPharmacy] = useState<Pharmacy | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    dispatch(getAllPharmacy());
  }, [counterPharmacy]);

  const handleEdit = (pharmacy: Pharmacy) => {
    setEditingPharmacy(pharmacy);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (updatedPharmacy: Pharmacy) => {
    // TODO: Implement API call to update pharmacy
    setPharmacies(
      pharmacies.map((p) => (p.id === updatedPharmacy.id ? updatedPharmacy : p))
    );
  };

  const handleDelete = (id: string) => {
    // TODO: Implement delete functionality
    console.log("Delete pharmacy:", id);
  };

  return (
    <>
      <div className="bg-white shadow rounded-lg">
        {/* ... existing content ... */}
        <div className="px-4 py-5 sm:p-6">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h2 className="text-xl font-semibold text-gray-900">
                Pharmacies
              </h2>
              <p className="mt-2 text-sm text-gray-700">
                Manage all registered pharmacies
              </p>
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
              <Button>Add Pharmacy</Button>
            </div>
          </div>

          {/* Mobile view */}
          <div className="mt-8 grid gap-4 md:hidden">
            {pharmacys.map((pharmacy: any) => (
              <div
                key={pharmacy._id}
                className="bg-white border rounded-lg overflow-hidden"
              >
                {
                  <img
                    src="https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&q=80&w=400"
                    className="w-full h-48 object-cover"
                  />
                }
                <div className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {pharmacy.name}
                      </h3>
                      <div className="flex items-center text-gray-500 mt-1">
                        <MapPin className="w-4 h-4 mr-1" />
                        {pharmacy.city}
                      </div>
                    </div>
                    <span
                      className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                        pharmacy.isOnDuty
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {pharmacy.isOnDuty
                        ? "Weekend/Emergency"
                        : "Regular Hours"}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center text-gray-500">
                      <Phone className="w-4 h-4 mr-1" />
                      {pharmacy.phone}
                    </div>
                    {pharmacy.email && (
                      <div className="flex items-center text-gray-500">
                        <Mail className="w-4 h-4 mr-1" />
                        {pharmacy.email}
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-2 pt-2 items-center ">
                    <Button
                      variant="outline"
                      onClick={() => handleEdit(pharmacy)}
                      className="flex-1"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleDelete(pharmacy.id)}
                      className="flex-1 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop view */}
          <div className="hidden md:block mt-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                      Pharmacy
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Contact
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {pharmacys.map((pharmacy: any) => (
                    <tr key={pharmacy._id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm">
                        <div className="flex items-center">
                          {
                            <img
                              src="https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&q=80&w=400"
                              className="h-12 w-12 rounded-lg object-cover mr-3"
                            />
                          }
                          <div>
                            <div className="font-medium text-gray-900">
                              {pharmacy.name}
                            </div>
                            <div className="flex items-center text-gray-500 mt-1">
                              <MapPin className="w-4 h-4 mr-1" />
                              {pharmacy.city}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-1" />
                          {pharmacy.phone}
                        </div>
                        {pharmacy.email && (
                          <div className="flex items-center mt-1">
                            <Mail className="w-4 h-4 mr-1" />
                            {pharmacy.email}
                          </div>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span
                          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                            pharmacy.isOnDuty
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {pharmacy.isOnDuty
                            ? "Weekend/Emergency"
                            : "Regular Hours"}
                        </span>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            onClick={() => handleEdit(pharmacy)}
                            className="inline-flex items-center"
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => handleDelete(pharmacy.id)}
                            className="inline-flex items-center text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <EditPharmacyModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingPharmacy(null);
        }}
        pharmacy={editingPharmacy}
        onSave={handleSaveEdit}
      />
    </>
  );
}
