'use client';

import React, { useState } from 'react';
import { useProject } from '@/context/ProjectContext';
import { Lock, UserPlus, X } from 'lucide-react';

type SavedAccount = {
  name: string;
  email: string;
  password: string;
  role: 'Project Manager';
  isManager: true;
};

const ACCOUNTS_STORAGE_KEY = 'pms_registered_accounts';

export function LoginModal() {
  const { isAuthModalOpen, closeAuthModal, login } = useProject();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  if (!isAuthModalOpen) return null;

  const getAccounts = (): SavedAccount[] => {
    try {
      return JSON.parse(localStorage.getItem(ACCOUNTS_STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    const normalizedEmail = email.trim().toLowerCase();

    if (mode === 'register') {
      if (password.length < 6) {
        setError('Use a password with at least 6 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setError('The passwords do not match.');
        return;
      }

      const accounts = getAccounts();
      if (accounts.some((account) => account.email.toLowerCase() === normalizedEmail)) {
        setError('An account with this email already exists.');
        return;
      }

      const account: SavedAccount = {
        name: name.trim(),
        email: normalizedEmail,
        password,
        role: 'Project Manager',
        isManager: true,
      };
      try {
        localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify([...accounts, account]));
      } catch {
        setError('Could not save the account on this device.');
        return;
      }
      login(account.name, account.role, account.email);
      return;
    }

    const account = getAccounts().find(
      (savedAccount) => savedAccount.email.toLowerCase() === normalizedEmail && savedAccount.password === password
    );
    if (!account) {
      setError('Email or password is incorrect.');
      return;
    }
    login(account.name, account.role, account.email);
  };

  const handleDemoLogin = () => {
    login('Lead Project Manager', 'Lead Project Manager', 'pm@pms.local');
  };

  const switchMode = (nextMode: 'login' | 'register') => {
    setMode(nextMode);
    setError('');
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center overflow-y-auto p-4">
      <button
        type="button"
        className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm"
        onClick={closeAuthModal}
        aria-label="Close sign in dialog"
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-dialog-title"
        className="relative z-10 my-auto w-full max-w-md overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-2xl"
      >
        <div className="flex items-start justify-between border-b border-neutral-100 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-none bg-neutral-100 text-neutral-800">
              {mode === 'login' ? <Lock className="h-5 w-5" /> : <UserPlus className="h-5 w-5" />}
            </div>
            <div>
              <h2 id="auth-dialog-title" className="text-base font-semibold text-neutral-900">
                {mode === 'login' ? 'Welcome back' : 'Create your account'}
              </h2>
              <p className="mt-0.5 text-xs text-neutral-500">
                {mode === 'login' ? 'Sign in to manage your projects.' : 'Register to manage your projects.'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeAuthModal}
            className="rounded-md p-2 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700 hover:cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-5 grid grid-cols-2 rounded-none bg-neutral-100 p-1 text-sm">
            <button
              type="button"
              onClick={() => switchMode('login')}
              className={`rounded-md px-3 py-2 font-medium transition ${mode === 'login' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-800 hover:cursor-pointer'}`}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => switchMode('register')}
              className={`rounded-none px-3 py-2 font-medium transition ${mode === 'register' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-800 hover:cursor-pointer'}`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label htmlFor="register-name" className="mb-1.5 block text-sm font-medium text-neutral-700">Full name</label>
                <input
                  id="register-name"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  autoComplete="name"
                  required
                  className="w-full rounded-none border border-neutral-300 px-3 py-2 text-xs outline-none transition placeholder:text-neutral-400 focus:border-neutral-500 focus:ring-4 focus:ring-neutral-100 sm:px-3.5 sm:py-2.5 sm:text-sm"
                  placeholder="Your name"
                />
              </div>
            )}
            <div>
              <label htmlFor="auth-email" className="mb-1.5 block text-sm font-medium text-neutral-700">Email</label>
              <input
                id="auth-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
                className="w-full rounded-none border border-neutral-300 px-3 py-2 text-xs outline-none transition placeholder:text-neutral-400 focus:border-neutral-500 focus:ring-4 focus:ring-neutral-100 sm:px-3.5 sm:py-2.5 sm:text-sm"
                placeholder="Email"
              />
            </div>
            <div>
              <label htmlFor="auth-password" className="mb-1.5 block text-sm font-medium text-neutral-700">Password</label>
              <input
                id="auth-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                required
                minLength={mode === 'register' ? 6 : undefined}
                className="w-full rounded-none border border-neutral-300 px-3 py-2 text-xs outline-none transition placeholder:text-neutral-400 focus:border-neutral-500 focus:ring-4 focus:ring-neutral-100 sm:px-3.5 sm:py-2.5 sm:text-sm"
                placeholder={mode === 'register' ? 'At least 6 characters' : 'Your password'}
              />
            </div>
            {mode === 'register' && (
              <div>
                <label htmlFor="auth-confirm-password" className="mb-1.5 block text-sm font-medium text-neutral-700">Confirm password</label>
                <input
                  id="auth-confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  autoComplete="new-password"
                  required
                  className="w-full rounded-none border border-neutral-300 px-3 py-2 text-xs outline-none transition placeholder:text-neutral-400 focus:border-neutral-500 focus:ring-4 focus:ring-neutral-100 sm:px-3.5 sm:py-2.5 sm:text-sm"
                  placeholder="Re-enter your password"
                />
              </div>
            )}

            {error && <p role="alert" className="rounded-none bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}

            <button
              type="submit"
              className="w-full rounded-none bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800 focus:outline-none focus:ring-4 focus:ring-neutral-200 hover:cursor-pointer"
            >
              {mode === 'login' ? 'Sign in' : 'Create account'}
            </button>
          </form>

        </div>
      </section>
    </div>
  );
}
