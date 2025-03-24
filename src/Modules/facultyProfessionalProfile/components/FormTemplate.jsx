/* eslint-disable jsx-a11y/label-has-associated-control */
// import { Save } from 'lucide-react'

export default function FormTemplate() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6">Add a Research Project</h2>
      <form className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="projectIncharge"
              className="block text-sm font-medium text-gray-700"
            >
              Project Incharge(PI)
            </label>
            <input
              type="text"
              id="projectIncharge"
              name="projectIncharge"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label
              htmlFor="coProjectIncharge"
              className="block text-sm font-medium text-gray-700"
            >
              Co-Project Incharge(CO-PI)
            </label>
            <input
              type="text"
              id="coProjectIncharge"
              name="coProjectIncharge"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="fundingAgency"
            className="block text-sm font-medium text-gray-700"
          >
            Funding Agency
          </label>
          <input
            type="text"
            id="fundingAgency"
            name="fundingAgency"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="submissionDate"
              className="block text-sm font-medium text-gray-700"
            >
              Submission Date
            </label>
            <input
              type="date"
              id="submissionDate"
              name="submissionDate"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label
              htmlFor="startDate"
              className="block text-sm font-medium text-gray-700"
            >
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label
              htmlFor="expectedFinishDate"
              className="block text-sm font-medium text-gray-700"
            >
              Expected Finish Date
            </label>
            <input
              type="date"
              id="expectedFinishDate"
              name="expectedFinishDate"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="projectTitle"
            className="block text-sm font-medium text-gray-700"
          >
            Title of Project
          </label>
          <input
            type="text"
            id="projectTitle"
            name="projectTitle"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {/* <Save className="w-5 h-5 mr-2" /> */}
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
