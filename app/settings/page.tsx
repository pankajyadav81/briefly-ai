import Sidebar from "../../components/Sidebar";

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-black text-white flex">

      <Sidebar />

      <main className="flex-1 p-10">

        <h1 className="text-5xl font-bold mb-3">
          Settings
        </h1>

        <p className="text-gray-400 mb-10">
          Manage your account preferences.
        </p>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 max-w-2xl">

          <div className="mb-6">
            <label className="block mb-2">
              Full Name
            </label>

            <input
              type="text"
              value="Pankaj"
              className="w-full p-3 bg-zinc-800 rounded-lg"
              readOnly
            />
          </div>

          <div className="mb-6">
            <label className="block mb-2">
              Email
            </label>

            <input
              type="email"
              value="user@example.com"
              className="w-full p-3 bg-zinc-800 rounded-lg"
              readOnly
            />
          </div>

          <button className="px-6 py-3 bg-blue-600 rounded-xl hover:bg-blue-700">
            Save Changes
          </button>

        </div>

      </main>

    </div>
  );
}