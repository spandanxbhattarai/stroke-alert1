import Sidebar from "../../components/Sidebar";
import HospitalForm from "../../components/HospitalForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Add Hospital" };

export default function NewHospitalPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-3xl">
          <div className="mb-6">
            <h1 className="text-2xl font-black text-gray-900">Add Hospital</h1>
            <p className="text-gray-500">Add a new hospital to the StrokeAlert network</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <HospitalForm mode="create" />
          </div>
        </div>
      </main>
    </div>
  );
}
