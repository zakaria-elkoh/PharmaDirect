import React, { useState, useEffect } from "react";
import { Modal } from "../../components/Modal";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { ImagePlus } from "lucide-react";
import {
  useForm,
  Controller,
  SubmitHandler,
  FieldValues,
} from "react-hook-form";
import type { Pharmacy } from "../../types";
import { updatePharmacy } from "@/store/features/pharmacySlice";
import { useAppDispatch, useAppSelector } from "@/hook";
import Swal from "sweetalert2";

interface EditPharmacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  pharmacy: any;
  onSave: (pharmacy: Pharmacy) => void;
}

interface FormValues {
  id: string;
  name: string;
  detailedAddress: string;
  phone: string;
  email: string;
  image?: string;
  isOnGard: boolean;
}

export function EditPharmacyModal({
  isOpen,
  onClose,
  pharmacy,
  onSave,
}: EditPharmacyModalProps) {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>();
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.phar);

  useEffect(() => {
    if (pharmacy) {
      setValue("id", pharmacy._id);
      setValue("name", pharmacy.name);
      setValue("detailedAddress", pharmacy.detailedAddress);
      setValue("phone", pharmacy.phone);
      setValue("email", pharmacy.email);
    }
  }, [pharmacy, setValue]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      const changes: Partial<FormValues> = {};

      if (pharmacy) {
        if (data.name !== pharmacy.name) changes.name = data.name;
        if (data.detailedAddress !== pharmacy.detailedAddress)
          changes.detailedAddress = data.detailedAddress;
        if (data.phone !== pharmacy.phone) changes.phone = data.phone;
        if (data.email !== pharmacy.email) changes.email = data.email;
        if (data.image !== pharmacy.image) changes.image = data.image;
        if (data.isOnGard !== pharmacy.isOnGard)
          changes.isOnGard = data.isOnGard;
      }

      if (Object.keys(changes).length > 0) {
        await dispatch(updatePharmacy({ data: changes, id: pharmacy._id }));

        Swal.fire({
          icon: "success",
          title: "Pharmacy updated successfully!",
          showConfirmButton: false,
          timer: 1500,
        });

        onClose();
      } else {
        Swal.fire({
          icon: "info",
          title: "No changes detected",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed to update pharmacy!",
        text: error.message || "Something went wrong",
      });
      console.error("Failed to update pharmacy:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Pharmacy">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pharmacy Image
          </label>
          <div className="flex items-center space-x-4">
            <Controller
              name="image"
              control={control}
              render={({ field }) => (
                <div className="relative">
                  {field.value ? (
                    <div>
                      <img
                        src={field.value}
                        alt="Pharmacy preview"
                        className="h-32 w-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => field.onChange("")}
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
                        {...field}
                      />
                    </div>
                  )}
                </div>
              )}
            />
          </div>
        </div>

        <Controller
          name="name"
          control={control}
          rules={{ required: "Pharmacy name is required" }}
          render={({ field }) => (
            <Input
              label="Pharmacy Name"
              required
              {...field}
              error={errors.name?.message}
            />
          )}
        />

        <Controller
          name="detailedAddress"
          control={control}
          rules={{ required: "Address is required" }}
          render={({ field }) => (
            <Input
              label="Address"
              required
              {...field}
              error={errors.detailedAddress?.message}
            />
          )}
        />

        <Controller
          name="phone"
          control={control}
          rules={{ required: "Phone number is required" }}
          render={({ field }) => (
            <Input
              label="Phone Number"
              required
              {...field}
              error={errors.phone?.message}
            />
          )}
        />

        <Controller
          name="email"
          control={control}
          rules={{
            required: "Email is required",
            pattern: {
              value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/,
              message: "Invalid email address",
            },
          }}
          render={({ field }) => (
            <Input
              label="Email"
              type="email"
              required
              {...field}
              error={errors.email?.message}
            />
          )}
        />

        <div className="flex items-center space-x-2">
          <Controller
            name="isOnGard"
            control={control}
            render={({ field }) => (
              <>
                <input
                  type="checkbox"
                  id="editIsOnGard"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  {...field}
                />
                <label
                  htmlFor="editIsOnGard"
                  className="text-sm font-medium text-gray-700"
                >
                  Open on weekends for emergency services
                </label>
              </>
            )}
          />
        </div>

        <div className="flex justify-end space-x-3">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
}
