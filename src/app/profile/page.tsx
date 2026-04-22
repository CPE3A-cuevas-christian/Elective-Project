'use client'

import React, { useContext, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
import { PixelBorder } from '@/components/pixelborder'
import { AuthContext } from '@/context/authcontext'

type ProfileFormProps = {
  user: {
    id: number
    email: string
    name?: string | null
  }
  updateProfile: (data: {
    name?: string
    email?: string
    password?: string
    oldPassword?: string
  }) => Promise<{ ok: boolean; error?: string }>
  logout: () => Promise<void>
}

function ProfileForm({ user, updateProfile, logout }: ProfileFormProps) {
  const [name, setName] = useState(user.name ?? '')
  const [email, setEmail] = useState(user.email)

  const [oldPassword, setOldPassword] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')

  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [showEditProfile, setShowEditProfile] = useState(false)
  const [showChangePassword, setShowChangePassword] = useState(false)

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setMessage(null)

    setSubmitting(true)

    const res = await updateProfile({
      name: name || undefined,
      email: email || undefined,
    })

    setSubmitting(false)

    if (!res.ok) {
      setError(res.error || 'Update failed')
      return
    }

    setMessage('Profile updated successfully.')
    setShowEditProfile(false)
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setMessage(null)

    if (!oldPassword) {
      setError('Please enter your current password.')
      return
    }

    if (!password) {
      setError('Please enter a new password.')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.')
      return
    }

    if (!/[A-Z]/.test(password)) {
      setError('Password must contain at least 1 uppercase letter.')
      return
    }

    if (!/[a-z]/.test(password)) {
      setError('Password must contain at least 1 lowercase letter.')
      return
    }

    if (!/[0-9]/.test(password)) {
      setError('Password must contain at least 1 number.')
      return
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      setError('Password must contain at least 1 special character.')
      return
    }

    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    setSubmitting(true)

    const res = await updateProfile({
      password,
      oldPassword,
    })

    setSubmitting(false)

    if (!res.ok) {
      setError(res.error || 'Password update failed')
      return
    }

    setOldPassword('')
    setPassword('')
    setConfirm('')
    setMessage('Password changed successfully.')
    setShowChangePassword(false)
  }

  return (
    <>
      <div className="text-center mb-6">
        <h1 className="font-pixel text-2xl text-dark-brown mb-2">
          Your Profile
        </h1>
        <p className="text-brown font-medium text-[12px]">
          Manage your account details
        </p>
      </div>

      <PixelBorder className="bg-parchment p-6 md:p-8">
        <div className="space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-300 text-red-800 px-3 py-2 rounded font-pixel text-[11px]">
              {error}
            </div>
          )}

          {message && (
            <div className="bg-green-100 border border-green-300 text-green-800 px-3 py-2 rounded font-pixel text-[11px]">
              {message}
            </div>
          )}

          <div className="bg-white border-2 border-brown p-4 space-y-3">
            <div>
              <p className="text-[11px] font-pixel text-brown mb-1">Name</p>
              <p className="text-dark-brown font-bold">
                {user.name || 'No name set'}
              </p>
            </div>

            <div>
              <p className="text-[11px] font-pixel text-brown mb-1">Email</p>
              <p className="text-dark-brown font-bold">{user.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <button
              type="button"
              onClick={() => {
                setShowEditProfile((prev) => !prev)
                setShowChangePassword(false)
                setError(null)
                setMessage(null)
              }}
              className="w-full bg-brown text-cream py-3 font-pixel text-xs pixel-border-sm hover:bg-dark-brown shadow-md"
            >
              {showEditProfile ? 'Close Edit Profile' : 'Edit Profile'}
            </button>

            <button
              type="button"
              onClick={() => {
                setShowChangePassword((prev) => !prev)
                setShowEditProfile(false)
                setError(null)
                setMessage(null)
              }}
              className="w-full bg-brown text-cream py-3 font-pixel text-xs pixel-border-sm hover:bg-dark-brown shadow-md"
            >
              {showChangePassword
                ? 'Close Change Password'
                : 'Change Password'}
            </button>

            <button
              type="button"
              onClick={() => logout()}
              className="w-full bg-brown text-cream py-3 font-pixel text-xs pixel-border-sm hover:bg-dark-brown shadow-md"
            >
              Logout
            </button>
          </div>

          {showEditProfile && (
            <form onSubmit={handleSaveProfile} className="space-y-4 pt-4">
              <div>
                <label className="block text-sm font-bold text-dark-brown mb-1">
                  Name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 bg-white border-2 border-brown focus:outline-none focus:border-green"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-dark-brown mb-1">
                  Email
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 bg-white border-2 border-brown focus:outline-none focus:border-green"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className={`w-full bg-brown text-cream py-3 font-pixel text-xs pixel-border-sm shadow-md ${
                  submitting
                    ? 'opacity-60 cursor-not-allowed'
                    : 'hover:bg-dark-brown'
                }`}
              >
                {submitting ? 'Saving...' : 'Save Profile'}
              </button>
            </form>
          )}

          {showChangePassword && (
            <form onSubmit={handleChangePassword} className="space-y-4 pt-4">
              <div>
                <label className="block text-sm font-bold text-dark-brown mb-1">
                  Current Password
                </label>

                <div className="relative">
                  <input
                    type={showOldPassword ? 'text' : 'password'}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full p-3 pr-12 bg-white border-2 border-brown focus:outline-none focus:border-green"
                    placeholder="Current password"
                  />

                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-brown"
                  >
                    {showOldPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-dark-brown mb-1">
                  New Password
                </label>

                <p className="text-[11px] text-brown mb-2">
                  Must be at least 8 characters with uppercase, lowercase,
                  number, and special character.
                </p>

                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 pr-12 bg-white border-2 border-brown focus:outline-none focus:border-green"
                    placeholder="New password"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-brown"
                  >
                    {showPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-dark-brown mb-1">
                  Confirm Password
                </label>

                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className="w-full p-3 pr-12 bg-white border-2 border-brown focus:outline-none focus:border-green"
                    placeholder="Confirm password"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-brown"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className={`w-full bg-brown text-cream py-3 font-pixel text-xs pixel-border-sm shadow-md ${
                  submitting
                    ? 'opacity-60 cursor-not-allowed'
                    : 'hover:bg-dark-brown'
                }`}
              >
                {submitting ? 'Saving...' : 'Save New Password'}
              </button>
            </form>
          )}
        </div>
      </PixelBorder>

      <div className="mt-4 text-center">
        <Link
          href="/bookmarks"
          className="text-green hover:text-dark-green font-pixel text-[10px]"
        >
          View Bookmarks
        </Link>
      </div>

      <p className="text-center mt-6">
        <Link
          href="/"
          className="text-brown hover:text-green font-pixel text-[10px] flex items-center justify-center gap-2"
        >
          <span>&larr;</span> Back to Home
        </Link>
      </p>
    </>
  )
}

export default function ProfilePage() {
  const { user, loading, updateProfile, logout } = useContext(AuthContext)
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login')
    }
  }, [loading, user, router])

  if (loading || !user) return null

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4 relative overflow-hidden">
      <div className="w-full max-w-md relative z-10">
        <ProfileForm
          key={user.id}
          user={user}
          updateProfile={updateProfile}
          logout={logout}
        />
      </div>
    </div>
  )
}