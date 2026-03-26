import { z } from "zod";
import { HOSPITAL_TYPES, SPECIALIZATIONS } from "../constants";

const googleMapsUrlRegex =
  /^(https?:\/\/)?(www\.)?(maps\.google\.com|goo\.gl\/maps|maps\.app\.goo\.gl).*/i;

export const createHospitalSchema = z.object({
  name: z.string().min(3, "Hospital name must be at least 3 characters"),
  addressLine1: z.string().min(1, "Address is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  country: z.string().default("Nepal"),
  postalCode: z.string().optional(),
  phone: z
    .string()
    .regex(/^\+?[\d\s\-()]{7,20}$/, "Invalid phone number format"),
  emergencyPhone: z
    .string()
    .regex(/^\+?[\d\s\-()]{7,20}$/, "Invalid phone number format")
    .optional()
    .or(z.literal("")),
  latitude: z.coerce
    .number()
    .min(-90, "Latitude must be between -90 and 90")
    .max(90, "Latitude must be between -90 and 90"),
  longitude: z.coerce
    .number()
    .min(-180, "Longitude must be between -180 and 180")
    .max(180, "Longitude must be between -180 and 180"),
  googleMapsLink: z
    .string()
    .url("Must be a valid URL")
    .refine(
      (url) => googleMapsUrlRegex.test(url),
      "Must be a valid Google Maps link (maps.google.com, goo.gl/maps, or maps.app.goo.gl)"
    ),
  type: z.enum(["GOVERNMENT", "PRIVATE", "NGO"]),
  specializations: z
    .array(z.enum(SPECIALIZATIONS))
    .min(1, "At least one specialization is required"),
  available24x7: z.boolean().default(true),
  isActive: z.boolean().default(true),
  notes: z.string().optional(),
});

export const updateHospitalSchema = createHospitalSchema.partial();

export const hospitalQuerySchema = z.object({
  lat: z.coerce.number().optional(),
  lng: z.coerce.number().optional(),
  limit: z.coerce.number().min(1).max(50).default(5),
  city: z.string().optional(),
  search: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(20),
});

export type CreateHospitalInput = z.infer<typeof createHospitalSchema>;
export type UpdateHospitalInput = z.infer<typeof updateHospitalSchema>;
export type HospitalQuery = z.infer<typeof hospitalQuerySchema>;
