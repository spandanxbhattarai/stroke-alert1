"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createHospitalSchema, SPECIALIZATIONS, type CreateHospitalInput } from "@strokealert/shared";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { Button } from "../../components/ui/Button";
import {
  CheckField,
  FieldShell,
  SelectField,
  TextAreaField,
  TextField,
} from "../../components/ui/Field";
import { API_URL } from "../../lib/api";

interface Props {
  defaultValues?: Partial<CreateHospitalInput>;
  hospitalId?: string;
  mode: "create" | "edit";
}

/** Numbered form section: index in the margin, fields on the grid beside it. */
function Section({
  index,
  title,
  hint,
  children,
}: {
  index: string;
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="grid grid-cols-12 gap-x-gutter gap-y-6 border-b border-rule py-8 first:pt-0">
      <div className="col-span-12 lg:col-span-3">
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-label tracking-[0.14em] text-signal">{index}</span>
          <h2 className="label-ink">{title}</h2>
        </div>
        {hint && <p className="mt-2 max-w-[30ch] text-small text-ink-3">{hint}</p>}
      </div>
      <div className="col-span-12 grid grid-cols-1 gap-x-gutter gap-y-6 sm:grid-cols-2 lg:col-span-9">
        {children}
      </div>
    </section>
  );
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

  const onSubmit = async (data: CreateHospitalInput) => {
    setLoading(true);
    setServerError(null);
    const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
    try {
      const url =
        mode === "edit"
          ? `${API_URL}/api/hospitals/${hospitalId}`
          : `${API_URL}/api/hospitals`;
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

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {serverError && (
        <p
          role="alert"
          className="mb-8 border border-signal px-4 py-3 font-mono text-micro uppercase tracking-[0.14em] text-signal"
        >
          {serverError}
        </p>
      )}

      <Section index="01" title="Identity" hint="How the hospital is listed to the public.">
        <TextField
          id="name"
          label="Hospital name"
          required
          className="sm:col-span-2"
          placeholder="Tribhuvan University Teaching Hospital"
          error={errors.name?.message}
          {...register("name")}
        />
        <SelectField
          id="type"
          label="Type"
          required
          error={errors.type?.message}
          {...register("type")}
        >
          <option value="GOVERNMENT">Government</option>
          <option value="PRIVATE">Private</option>
          <option value="NGO">NGO</option>
        </SelectField>
        <div className="flex flex-wrap items-end gap-6">
          <CheckField label="Available 24 / 7" {...register("available24x7")} />
          <CheckField label="Active" {...register("isActive")} />
        </div>
      </Section>

      <Section index="02" title="Address" hint="Written as someone reading it aloud to a driver.">
        <TextField
          id="addressLine1"
          label="Address line 1"
          required
          className="sm:col-span-2"
          placeholder="Maharajgunj Road"
          error={errors.addressLine1?.message}
          {...register("addressLine1")}
        />
        <TextField
          id="addressLine2"
          label="Address line 2"
          className="sm:col-span-2"
          placeholder="Ward 3, near the main gate"
          error={errors.addressLine2?.message}
          {...register("addressLine2")}
        />
        <TextField
          id="city"
          label="City"
          required
          placeholder="Kathmandu"
          error={errors.city?.message}
          {...register("city")}
        />
        <TextField
          id="state"
          label="Province / state"
          required
          placeholder="Bagmati"
          error={errors.state?.message}
          {...register("state")}
        />
        <TextField
          id="country"
          label="Country"
          placeholder="Nepal"
          error={errors.country?.message}
          {...register("country")}
        />
        <TextField
          id="postalCode"
          label="Postal code"
          placeholder="44600"
          error={errors.postalCode?.message}
          {...register("postalCode")}
        />
      </Section>

      <Section index="03" title="Contact" hint="The emergency line is the number shown first to the public.">
        <TextField
          id="phone"
          label="Phone"
          required
          type="tel"
          placeholder="+977-1-4412303"
          error={errors.phone?.message}
          {...register("phone")}
        />
        <TextField
          id="emergencyPhone"
          label="Emergency phone"
          type="tel"
          placeholder="+977-1-4412505"
          error={errors.emergencyPhone?.message}
          {...register("emergencyPhone")}
        />
      </Section>

      <Section
        index="04"
        title="Coordinates"
        hint="These place the hospital on the public Nepal map. Copy them from Google Maps."
      >
        <TextField
          id="latitude"
          label="Latitude"
          required
          type="number"
          step="any"
          placeholder="27.7376"
          error={errors.latitude?.message}
          {...register("latitude")}
        />
        <TextField
          id="longitude"
          label="Longitude"
          required
          type="number"
          step="any"
          placeholder="85.3317"
          error={errors.longitude?.message}
          {...register("longitude")}
        />
        <TextField
          id="googleMapsLink"
          label="Google Maps link"
          required
          className="sm:col-span-2"
          placeholder="https://maps.google.com/?q=27.7376,85.3317"
          error={errors.googleMapsLink?.message}
          {...register("googleMapsLink")}
        />
      </Section>

      <Section
        index="05"
        title="Capability"
        hint="What this hospital can actually do for a stroke patient."
      >
        <div className="sm:col-span-2">
          <Controller
            control={control}
            name="specializations"
            render={({ field }) => (
              <FieldShell
                label="Specializations"
                required
                error={errors.specializations?.message as string | undefined}
              >
                <div className="flex flex-wrap gap-px pt-1.5">
                  {SPECIALIZATIONS.map((spec) => {
                    const checked = field.value?.includes(spec);
                    return (
                      <button
                        key={spec}
                        type="button"
                        aria-pressed={checked}
                        onClick={() => {
                          const current = field.value || [];
                          field.onChange(
                            checked ? current.filter((s) => s !== spec) : [...current, spec]
                          );
                        }}
                        className={clsx(
                          "tap border px-3.5 font-mono text-micro uppercase tracking-[0.14em] transition-colors",
                          checked
                            ? "border-ink bg-ink text-paper"
                            : "border-rule text-ink-2 hover:border-ink hover:text-ink"
                        )}
                      >
                        {spec}
                      </button>
                    );
                  })}
                </div>
              </FieldShell>
            )}
          />
        </div>
      </Section>

      <Section index="06" title="Notes" hint="Anything a dispatcher should know. Optional.">
        <TextAreaField
          id="notes"
          label="Internal notes"
          rows={4}
          className="sm:col-span-2"
          placeholder="Stroke unit on the second floor; CT available around the clock."
          error={errors.notes?.message}
          {...register("notes")}
        />
      </Section>

      {/* sticky action bar */}
      <div className="sticky bottom-0 z-10 -mx-inset mt-8 flex flex-wrap gap-px border-t border-ink bg-paper px-inset py-4">
        <Button type="submit" variant="signal" size="lg" disabled={loading}>
          {loading ? "Saving…" : mode === "edit" ? "Update hospital" : "Add hospital"}
        </Button>
        <Button type="button" variant="ghost" size="lg" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
