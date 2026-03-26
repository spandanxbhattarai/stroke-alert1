"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createHospitalSchema, SPECIALIZATIONS, type CreateHospitalInput } from "@strokealert/shared";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  defaultValues?: Partial<CreateHospitalInput>;
  hospitalId?: string;
  mode: "create" | "edit";
}

export default function HospitalForm({ defaultValues, hospitalId, mode }: Props) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateHospitalInput>({
    resolver: zodResolver(createHospitalSchema),
    defaultValues: {
      country: "Nepal",
      available24x7: true,
      isActive: true,
      specializations: [],
      ...defaultValues,
    },
  });

  const getToken = () =>
    typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;

  const onSubmit = async (data: CreateHospitalInput) => {
    setLoading(true);
    setServerError(null);
    const token = getToken();
    try {
      const url =
        mode === "edit"
          ? `${process.env.NEXT_PUBLIC_API_URL}/api/hospitals/${hospitalId}`
          : `${process.env.NEXT_PUBLIC_API_URL}/api/hospitals`;
      const res = await fetch(url, {
        method: mode === "edit" ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) {
        setServerError(result.error || "Failed to save hospital");
        return;
      }
      router.push("/admin/hospitals");
      router.refresh();
    } catch {
      setServerError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const Field = ({
    label,
    name,
    required,
    ...rest
  }: {
    label: string;
    name: keyof CreateHospitalInput;
    required?: boolean;
    [key: string]: any;
  }) => (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        {...register(name as any)}
        {...rest}
        className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-red-500 text-sm"
      />
      {errors[name] && (
        <p className="text-red-600 text-xs mt-1">{errors[name]?.message as string}</p>
      )}
    </div>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {serverError && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm">
          {serverError}
        </div>
      )}

      {/* Basic Info */}
      <section>
        <h3 className="font-bold text-gray-800 mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <Field label="Hospital Name" name="name" required placeholder="e.g. Tribhuvan University Teaching Hospital" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Type <span className="text-red-500">*</span>
            </label>
            <select
              {...register("type")}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-red-500 text-sm"
            >
              <option value="GOVERNMENT">Government</option>
              <option value="PRIVATE">Private</option>
              <option value="NGO">NGO</option>
            </select>
            {errors.type && <p className="text-red-600 text-xs mt-1">{errors.type.message}</p>}
          </div>
          <div className="flex items-center gap-4 pt-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" {...register("available24x7")} className="w-4 h-4 rounded" />
              <span className="text-sm font-medium text-gray-700">Available 24/7</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" {...register("isActive")} className="w-4 h-4 rounded" />
              <span className="text-sm font-medium text-gray-700">Active</span>
            </label>
          </div>
        </div>
      </section>

      {/* Address */}
      <section>
        <h3 className="font-bold text-gray-800 mb-4">Address</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <Field label="Address Line 1" name="addressLine1" required placeholder="Street address" />
          </div>
          <div className="sm:col-span-2">
            <Field label="Address Line 2" name="addressLine2" placeholder="Apartment, ward, etc." />
          </div>
          <Field label="City" name="city" required placeholder="e.g. Kathmandu" />
          <Field label="State / Province" name="state" required placeholder="e.g. Bagmati" />
          <Field label="Country" name="country" placeholder="Nepal" />
          <Field label="Postal Code" name="postalCode" placeholder="44600" />
        </div>
      </section>

      {/* Contact */}
      <section>
        <h3 className="font-bold text-gray-800 mb-4">Contact Numbers</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Phone Number" name="phone" required type="tel" placeholder="+977-1-4412303" />
          <Field label="Emergency Phone (optional)" name="emergencyPhone" type="tel" placeholder="+977-1-4412505" />
        </div>
      </section>

      {/* Location */}
      <section>
        <h3 className="font-bold text-gray-800 mb-4">Location & Maps</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Latitude" name="latitude" required type="number" step="any" placeholder="27.7376" />
          <Field label="Longitude" name="longitude" required type="number" step="any" placeholder="85.3317" />
          <div className="sm:col-span-2">
            <Field
              label="Google Maps Link"
              name="googleMapsLink"
              required
              placeholder="https://maps.google.com/?q=..."
            />
          </div>
        </div>
      </section>

      {/* Specializations */}
      <section>
        <h3 className="font-bold text-gray-800 mb-4">Specializations</h3>
        <Controller
          control={control}
          name="specializations"
          render={({ field }) => (
            <div className="flex flex-wrap gap-2">
              {SPECIALIZATIONS.map((spec) => {
                const checked = field.value?.includes(spec);
                return (
                  <button
                    key={spec}
                    type="button"
                    onClick={() => {
                      const current = field.value || [];
                      field.onChange(
                        checked ? current.filter((s) => s !== spec) : [...current, spec]
                      );
                    }}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border-2 transition-colors ${
                      checked
                        ? "bg-red-600 text-white border-red-600"
                        : "bg-white text-gray-600 border-gray-200 hover:border-red-300"
                    }`}
                  >
                    {spec}
                  </button>
                );
              })}
            </div>
          )}
        />
        {errors.specializations && (
          <p className="text-red-600 text-xs mt-2">{errors.specializations.message as string}</p>
        )}
      </section>

      {/* Notes */}
      <section>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Notes (optional)</label>
        <textarea
          {...register("notes")}
          rows={3}
          placeholder="Any additional information..."
          className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-red-500 text-sm"
        />
      </section>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white font-bold px-8 py-3 rounded-xl transition-colors"
        >
          {loading ? "Saving..." : mode === "edit" ? "Update Hospital" : "Add Hospital"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-8 py-3 rounded-xl transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
