
import { Save, Bell, Lock, Globe, Palette } from 'lucide-react';

const AdminSettings = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold dark:text-white">Settings</h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="p-6 border-b dark:border-gray-700">
          <h2 className="text-lg font-semibold dark:text-white">Notifications</h2>
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Bell className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="font-medium dark:text-white">Email Notifications</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Receive email about course updates</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Bell className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="font-medium dark:text-white">Push Notifications</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Receive push notifications about updates</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        <div className="p-6 border-b dark:border-gray-700">
          <h2 className="text-lg font-semibold dark:text-white">Security</h2>
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Lock className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="font-medium dark:text-white">Two-Factor Authentication</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Add an extra layer of security</p>
                </div>
              </div>
              <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 rounded-lg">
                Enable
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 border-b dark:border-gray-700">
          <h2 className="text-lg font-semibold dark:text-white">Language & Region</h2>
          <div className="mt-4 space-y-4">
            <div className="flex items-center">
              <Globe className="w-5 h-5 text-gray-400 mr-3" />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Language
                </label>
                <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600">
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <h2 className="text-lg font-semibold dark:text-white">Appearance</h2>
          <div className="mt-4 space-y-4">
            <div className="flex items-center">
              <Palette className="w-5 h-5 text-gray-400 mr-3" />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Theme
                </label>
                <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600">
                  <option>Light</option>
                  <option>Dark</option>
                  <option>System</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          <Save className="w-5 h-5 mr-2" />
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default AdminSettings;