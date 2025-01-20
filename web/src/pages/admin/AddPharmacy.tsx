import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Layout } from "./Layout";
import { Button } from "../../components/Button";
import { ImagePlus } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hook";
import { createPharmacy } from "@/store/features/pharmacySlice";
import Swal from "sweetalert2";

interface PharmacyFormValues {
  image: FileList;
  name: string;
  phone: string;
  city: string;
  latitude: number;
  longitude: number;
  detailedAddress: string;
  email?: string;
  isOnDuty?: boolean;
  description?: string;
}

export function AddPharmacy() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PharmacyFormValues>();
  const { isLoading } = useAppSelector((state) => state.phar);
  const dispatch = useAppDispatch();
  const [imagePreview, setImagePreview] = useState<any>();

  const [image, setImage] = useState<any>();
  const [preview, setPreview] = useState<string>("");

  const onSubmit: SubmitHandler<PharmacyFormValues> = async (data) => {
    try {
      console.log("Pharmacy Data:", data);

      Swal.fire({
        title: "Loading...",
        text: "Please wait while we add the pharmacy.",
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      data.image = image;

      await dispatch(createPharmacy(data));

      Swal.fire({
        icon: "success",
        title: "Pharmacy Added Successfully!",
        text: "The pharmacy has been added successfully.",
      });

      // reset();
    } catch (error) {
      console.error("Failed to add pharmacy:", error);

      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong. Please try again later.",
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a URL for the selected image file and set it for preview
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
      setImage(file); // Store the image file itself
    }
  };

 



  return (
    <Layout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            Add New Pharmacy
          </h1>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="py-4">
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-6 max-w-2xl"
                >
                  {/* Image Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pharmacy Image
                    </label>
                    <div className="flex items-center space-x-4">
                      <div className="flex justify-center items-center h-32 w-32 border-2 border-dashed border-gray-300 rounded-lg relative">
                        <div className="text-center">
                          <ImagePlus className="mx-auto h-8 w-8 text-gray-400" />
                          <span className="mt-2 block text-sm font-medium text-gray-600">
                            Add Image
                          </span>
                        </div>
                        <input
                          {...register("image", {
                            required: "Image is required",
                          })}
                          type="file"
                          accept="image/*"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          onChange={handleImageChange}
                        />
                      </div>
                      {imagePreview && (
                        <div className="mt-2 w-32 h-32 border-2 border-gray-300 rounded-lg overflow-hidden">
                          <img
                            src={imagePreview}
                            alt="Image preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      {errors.image && (
                        <p className="text-red-500 text-sm">
                          {errors.image.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Remaining form inputs for name, phone, etc... */}
                  {/* Add similar input fields as before for other form values like name, phone, etc. */}

                  {/* Name Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pharmacy Name
                    </label>
                    <input
                      {...register("name", {
                        required: "Pharmacy name is required",
                      })}
                      placeholder="Enter pharmacy name"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  {/* Phone Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      {...register("phone", {
                        required: "Phone number is required",
                        pattern: {
                          value: /^[0-9]+$/,
                          message: "Invalid phone number",
                        },
                      })}
                      placeholder="Enter phone number"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>

                  {/* City Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      {...register("city", {
                        required: "City is required",
                      })}
                      placeholder="Enter city"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    {errors.city && (
                      <p className="text-red-500 text-sm">
                        {errors.city.message}
                      </p>
                    )}
                  </div>

                  {/* Latitude and Longitude */}
                  <div className="flex space-x-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Latitude
                      </label>
                      <input
                        {...register("latitude", {
                          required: "Latitude is required",
                        })}
                        type="number"
                        step="any"
                        placeholder="Enter latitude"
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                      {errors.latitude && (
                        <p className="text-red-500 text-sm">
                          {errors.latitude.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Longitude
                      </label>
                      <input
                        {...register("longitude", {
                          required: "Longitude is required",
                        })}
                        type="number"
                        step="any"
                        placeholder="Enter longitude"
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                      {errors.longitude && (
                        <p className="text-red-500 text-sm">
                          {errors.longitude.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Detailed Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Detailed Address
                    </label>
                    <input
                      {...register("detailedAddress", {
                        required: "Detailed address is required",
                      })}
                      placeholder="Enter detailed address"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    {errors.detailedAddress && (
                      <p className="text-red-500 text-sm">
                        {errors.detailedAddress.message}
                      </p>
                    )}
                  </div>

                  {/* Email Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email (Optional)
                    </label>
                    <input
                      {...register("email", {
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Invalid email address",
                        },
                      })}
                      placeholder="Enter email address"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      {...register("description")}
                      placeholder="Enter a brief description"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    ></textarea>
                  </div>

                  {/* Is On Duty */}
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isOnDuty"
                      {...register("isOnDuty")}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="isOnDuty"
                      className="text-sm font-medium text-gray-700"
                    >
                      Open on weekends for emergency services
                    </label>
                  </div>
                  {/* Submit Button */}
                  <div className="flex justify-end">
                    <Button type="submit" isLoading={isLoading}>
                      Add Pharmacy
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
