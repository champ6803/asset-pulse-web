"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { UserRole } from '@/types';

export default function LoginPage() {
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, selectRole } = useAuthStore();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(username, password);
      setShowRoleSelection(true);
    } catch (err) {
      setError('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleSelect = (role: UserRole) => {
    selectRole(role);
    
    // Redirect based on role
    switch (role) {
      case 'employee':
        router.push('/dashboard/employee');
        break;
      case 'manager':
        router.push('/dashboard/manager');
        break;
      case 'subsidiary-cto':
        router.push('/dashboard/cto');
        break;
      case 'group-cto':
        router.push('/dashboard/group-cto');
        break;
      default:
        router.push('/dashboard/employee');
    }
  };

  const roles = [
    {
      key: 'employee' as UserRole,
      label: 'Employee/HR',
      description: 'Basic asset access',
      icon: 'fa-user',
      bgColor: 'bg-blue-100',
      hoverColor: 'group-hover:bg-blue-200',
      iconColor: 'text-blue-600',
    },
    {
      key: 'manager' as UserRole,
      label: 'Department Manager',
      description: 'Department oversight',
      icon: 'fa-users',
      bgColor: 'bg-green-100',
      hoverColor: 'group-hover:bg-green-200',
      iconColor: 'text-green-600',
    },
    {
      key: 'subsidiary-cto' as UserRole,
      label: 'Subsidiary CTO',
      description: 'Subsidiary management',
      icon: 'fa-building',
      bgColor: 'bg-purple-100',
      hoverColor: 'group-hover:bg-purple-200',
      iconColor: 'text-purple-600',
    },
    {
      key: 'group-cto' as UserRole,
      label: 'Group CTO',
      description: 'Full system access',
      icon: 'fa-crown',
      bgColor: 'bg-red-100',
      hoverColor: 'group-hover:bg-red-200',
      iconColor: 'text-red-600',
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        {!showRoleSelection ? (
          <>
            <div className="text-center">
              <div className="mb-8">
                <div className="mx-auto h-16 w-16 bg-primary-600 rounded-xl flex items-center justify-center mb-4">
                  <i className="fas fa-chart-line text-white text-2xl"></i>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Asset Pulse</h1>
                <p className="text-sm text-gray-500">SCBX Group Asset Management</p>
              </div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Welcome back</h2>
                <p className="text-sm text-gray-600">Please sign in to your account</p>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <div className="space-y-1">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fas fa-user text-gray-400 text-sm"></i>
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                    placeholder="Enter your username"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fas fa-lock text-gray-400 text-sm"></i>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                    placeholder="Enter your password"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-sm`}></i>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <span className="font-medium text-primary-600 hover:text-primary-500 transition-colors cursor-pointer">
                    Forgot password?
                  </span>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <i className="fas fa-sign-in-alt text-primary-500 group-hover:text-primary-400"></i>
                  </span>
                  {loading ? 'Signing in...' : 'Sign in'}
                </button>
              </div>
            </form>

            {/* Demo credentials */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-xs font-medium text-gray-700 mb-2">Demo Accounts:</p>
              <div className="space-y-1 text-xs text-gray-600">
                <p>• employee@scb.com / password</p>
                <p>• manager@scb.com / password</p>
                <p>• cto@scb.com / password</p>
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Select Your Role</h3>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {roles.map((role) => (
                <button
                  key={role.key}
                  onClick={() => handleRoleSelect(role.key)}
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors group"
                >
                  <div className="flex-shrink-0">
                    <div className={`h-8 w-8 ${role.bgColor} rounded-lg flex items-center justify-center ${role.hoverColor}`}>
                      <i className={`fas ${role.icon} ${role.iconColor} text-sm`}></i>
                    </div>
                  </div>
                  <div className="ml-3 text-left">
                    <p className="text-sm font-medium text-gray-900">{role.label}</p>
                    <p className="text-xs text-gray-500">{role.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

