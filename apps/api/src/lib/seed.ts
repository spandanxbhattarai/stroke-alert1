import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

export async function seedIfEmpty() {
  try {
    const hospitalCount = await prisma.hospital.count();
    if (hospitalCount > 0) {
      console.log("Database already seeded, skipping.");
      return;
    }

    console.log("Seeding database...");

    // Seed admin
    const passwordHash = await bcrypt.hash("admin123456", 10);
    await prisma.admin.upsert({
      where: { email: "admin@strokealert.com" },
      update: {},
      create: {
        email: "admin@strokealert.com",
        passwordHash,
      },
    });

    // Seed sample hospitals in Nepal
    const hospitals = [
      {
        name: "Tribhuvan University Teaching Hospital",
        addressLine1: "Maharajgunj",
        city: "Kathmandu",
        state: "Bagmati",
        country: "Nepal",
        phone: "+977-1-4412303",
        emergencyPhone: "+977-1-4412505",
        latitude: 27.7376,
        longitude: 85.3317,
        googleMapsLink: "https://maps.google.com/?q=Tribhuvan+University+Teaching+Hospital",
        type: "GOVERNMENT" as const,
        specializations: ["Neurology", "Stroke Unit", "ICU", "Emergency Medicine"],
        available24x7: true,
        isActive: true,
      },
      {
        name: "Bir Hospital",
        addressLine1: "Kanti Path",
        city: "Kathmandu",
        state: "Bagmati",
        country: "Nepal",
        phone: "+977-1-4221119",
        latitude: 27.7041,
        longitude: 85.3131,
        googleMapsLink: "https://maps.google.com/?q=Bir+Hospital+Kathmandu",
        type: "GOVERNMENT" as const,
        specializations: ["Emergency Medicine", "Neurology", "ICU"],
        available24x7: true,
        isActive: true,
      },
      {
        name: "Norvic International Hospital",
        addressLine1: "Thapathali",
        city: "Kathmandu",
        state: "Bagmati",
        country: "Nepal",
        phone: "+977-1-4258554",
        emergencyPhone: "+977-1-4258558",
        latitude: 27.6939,
        longitude: 85.3147,
        googleMapsLink: "https://maps.google.com/?q=Norvic+International+Hospital",
        type: "PRIVATE" as const,
        specializations: ["Neurology", "Stroke Unit", "ICU", "Cardiology"],
        available24x7: true,
        isActive: true,
      },
      {
        name: "Manipal Teaching Hospital",
        addressLine1: "Deep Height, Phulbari-11",
        city: "Pokhara",
        state: "Gandaki",
        country: "Nepal",
        phone: "+977-61-526416",
        latitude: 28.2096,
        longitude: 83.9856,
        googleMapsLink: "https://maps.google.com/?q=Manipal+Teaching+Hospital+Pokhara",
        type: "PRIVATE" as const,
        specializations: ["Neurology", "ICU", "Emergency Medicine", "Neurosurgery"],
        available24x7: true,
        isActive: true,
      },
      {
        name: "B.P. Koirala Institute of Health Sciences",
        addressLine1: "Dharan-18",
        city: "Dharan",
        state: "Koshi",
        country: "Nepal",
        phone: "+977-25-525555",
        latitude: 26.8065,
        longitude: 87.2846,
        googleMapsLink: "https://maps.google.com/?q=BPKIHS+Dharan",
        type: "GOVERNMENT" as const,
        specializations: ["Neurology", "Stroke Unit", "ICU", "Neurosurgery", "Radiology"],
        available24x7: true,
        isActive: true,
      },
    ];

    for (const hospital of hospitals) {
      await prisma.hospital.create({ data: hospital });
    }

    console.log("Seed completed: 5 hospitals + admin user created.");
  } catch (error) {
    console.error("Seed failed:", error);
  }
}
