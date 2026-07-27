import type { Metadata } from "next";
import AdminShell from "../../components/AdminShell";
import HospitalForm from "../../components/HospitalForm";

export const metadata: Metadata = { title: "Add Hospital" };

export default function NewHospitalPage() {
  return (
    <AdminShell
      index="03"
      kicker="New record"
      title="Add hospital"
      lede="Six sections. Coordinates and the emergency number are the two fields people depend on most."
    >
      <HospitalForm mode="create" />
    </AdminShell>
  );
}
