import EmployeeForm from "@/components/EmployeeForm"

export default function NouveauSalariePage() {
  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Nouveau salarié</h1>
        <p className="text-sm text-gray-500 mt-0.5">Saisir les informations du salarié lors de son onboarding</p>
      </div>
      <EmployeeForm />
    </div>
  )
}
