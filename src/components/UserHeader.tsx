"use client";

import Link from "next/link";

interface UserHeaderProps {
  user: { email: string; username: string; isAdmin: boolean } | null;
  onLoginClick: () => void;
  onLogout: () => void;
}

export default function UserHeader({ user, onLoginClick, onLogout }: UserHeaderProps) {
  return (
    <div className="w-full flex items-center justify-end px-4 sm:px-6 pt-4 pb-2">
      <div className="flex items-center gap-3">
        {user ? (
          <>
            <Link
              href="/profile"
              className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm text-xs font-medium text-gray-300 hover:bg-white/10 transition"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21v-1a6 6 0 0 1 12 0v1" />
              </svg>
              {user.username}
            </Link>
            <button
              onClick={onLogout}
              className="px-3 py-1.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm text-xs font-medium text-gray-300 hover:bg-red-500/20 hover:border-red-400/30 transition"
            >
              Logout
            </button>
            {user.isAdmin && (
              <Link
                href="/admin-registrations"
                className="px-3 py-1.5 rounded-full border border-amber-400/30 bg-amber-500/10 backdrop-blur-sm text-xs font-medium text-amber-300 hover:bg-amber-500/20 transition"
              >
                Admin Console
              </Link>
            )}
          </>
        ) : (
          <button
            onClick={onLoginClick}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm text-xs font-medium text-gray-300 hover:bg-white/10 transition"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
            Login / Sign Up
          </button>
        )}
      </div>
    </div>
  );
}
