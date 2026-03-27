"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hospitalQuerySchema = exports.updateHospitalSchema = exports.createHospitalSchema = void 0;
const zod_1 = require("zod");
const constants_1 = require("../constants");
const googleMapsUrlRegex = /^(https?:\/\/)?(www\.)?(maps\.google\.com|goo\.gl\/maps|maps\.app\.goo\.gl).*/i;
exports.createHospitalSchema = zod_1.z.object({
    name: zod_1.z.string().min(3, "Hospital name must be at least 3 characters"),
    addressLine1: zod_1.z.string().min(1, "Address is required"),
    addressLine2: zod_1.z.string().optional(),
    city: zod_1.z.string().min(1, "City is required"),
    state: zod_1.z.string().min(1, "State is required"),
    country: zod_1.z.string().default("Nepal"),
    postalCode: zod_1.z.string().optional(),
    phone: zod_1.z
        .string()
        .regex(/^\+?[\d\s\-()]{7,20}$/, "Invalid phone number format"),
    emergencyPhone: zod_1.z
        .string()
        .regex(/^\+?[\d\s\-()]{7,20}$/, "Invalid phone number format")
        .optional()
        .or(zod_1.z.literal("")),
    latitude: zod_1.z.coerce
        .number()
        .min(-90, "Latitude must be between -90 and 90")
        .max(90, "Latitude must be between -90 and 90"),
    longitude: zod_1.z.coerce
        .number()
        .min(-180, "Longitude must be between -180 and 180")
        .max(180, "Longitude must be between -180 and 180"),
    googleMapsLink: zod_1.z
        .string()
        .url("Must be a valid URL")
        .refine((url) => googleMapsUrlRegex.test(url), "Must be a valid Google Maps link (maps.google.com, goo.gl/maps, or maps.app.goo.gl)"),
    type: zod_1.z.enum(["GOVERNMENT", "PRIVATE", "NGO"]),
    specializations: zod_1.z
        .array(zod_1.z.enum(constants_1.SPECIALIZATIONS))
        .min(1, "At least one specialization is required"),
    available24x7: zod_1.z.boolean().default(true),
    isActive: zod_1.z.boolean().default(true),
    notes: zod_1.z.string().optional(),
});
exports.updateHospitalSchema = exports.createHospitalSchema.partial();
exports.hospitalQuerySchema = zod_1.z.object({
    lat: zod_1.z.coerce.number().optional(),
    lng: zod_1.z.coerce.number().optional(),
    limit: zod_1.z.coerce.number().min(1).max(50).default(5),
    city: zod_1.z.string().optional(),
    search: zod_1.z.string().optional(),
    page: zod_1.z.coerce.number().min(1).default(1),
    pageSize: zod_1.z.coerce.number().min(1).max(100).default(20),
});
