import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { loginUser } from '../../features/auth/authSlice'
import { useAppDispatch, useAppSelector } from '../../store/hooks'

function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const dispatch = useAppDispatch()
  const { error: apiError, isLoading } = useAppSelector((state) => state.auth)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setSubmitted(false)

    const form = new FormData(event.currentTarget)
    const email = String(form.get('email') ?? '').trim()
    const password = String(form.get('password') ?? '')

    if (!email.includes('@')) {
      setError('Please enter a valid email address.')
      return
    }

    if (!password) {
      setError('Please enter your password.')
      return
    }

    try {
      await dispatch(loginUser({ email, password })).unwrap()
      setSubmitted(true)
    } catch {
      setSubmitted(false)
    }
  }

  return (
    <main className="grid min-h-screen grid-cols-1 bg-[#fbfcfe] text-[#182238] min-[821px]:grid-cols-[minmax(400px,44%)_1fr]">
      <section className="relative flex min-h-[300px] flex-col overflow-hidden bg-[#101a30] px-[8vw] py-7 text-[#f5f7ff] min-[821px]:min-h-0 min-[821px]:px-[7vw] min-[821px]:py-12" aria-label="Application introduction">
        <div className="relative z-10 grid h-9 w-9 place-items-center rounded-[9px] border border-[#435491] bg-[#1d2a52] text-[17px] font-bold text-[#9eafff]"><span className="grid h-3.5 w-3.5 place-items-center rounded-full border-2 border-current text-[9px]">✓</span></div>
        <span className="absolute left-[calc(8vw+48px)] top-9 font-['Manrope'] text-[17px] font-bold min-[821px]:left-[calc(7vw+48px)] min-[821px]:top-[55px]">Veloura</span>

        <div className="relative z-10 my-[70px] max-w-[440px] min-[821px]:my-auto">
          <p className="mb-3.5 text-xs font-bold uppercase tracking-[.12em] text-[#7283b0]">A better way to work together</p>
          <h1 className="mb-5 font-['Manrope'] text-[2.25rem] font-medium leading-[1.12] tracking-[-.05em] text-[#f5f7ff] min-[481px]:text-[2.6rem] min-[821px]:text-[clamp(2.4rem,4vw,4rem)]">The platform your<br />team has been<br />waiting for.</h1>
          <p className="max-w-[390px] text-[15px] leading-[1.7] text-[#8997b5]">Bring together workflows, data, and people so your team can focus on what actually matters.</p>
        </div>

        <blockquote className="relative z-10 m-0 max-w-[480px] rounded-2xl border border-[rgba(125,145,215,.19)] bg-[rgba(33,45,76,.54)] px-[22px] py-6 text-[13px] leading-[1.65] text-[#aeb9d1] max-[820px]:hidden">
          <p className="mb-4">“This platform transformed how our team collaborates. It's intuitive, fast, and has genuinely made us more effective.”</p>
          <footer className="flex items-center gap-2.5"><span className="grid h-8 w-8 place-items-center rounded-full bg-[#303e72] text-[10px] font-bold text-[#aebaff]">SK</span><span><strong className="block text-xs text-[#e2e7f4]">Sophia Kim</strong><small className="block text-[11px] text-[#7888a9]">Head of Product, Lumi AI</small></span></footer>
        </blockquote>
      </section>

      <section className="grid place-items-center px-[8vw] py-[46px] min-[821px]:px-[7vw] min-[821px]:py-[52px]">
        <div className="w-full max-w-[384px]">
          <div className="mb-8">
            <p className="mb-3.5 text-xs font-bold uppercase tracking-[.12em] text-[#7283b0]">Welcome back</p>
            <h2 className="mb-2 font-['Manrope'] text-[clamp(1.7rem,3vw,2.1rem)] font-bold leading-[1.2] tracking-[-.04em] text-[#182238]">Sign in to your account</h2>
            <p className="text-sm text-[#7a879d]">Sign in to continue to your workspace.</p>
          </div>

          <form className="grid gap-[9px]" onSubmit={handleSubmit} noValidate>
            <label className="text-[13px] font-semibold text-[#354158]" htmlFor="login-email">Email address</label>
            <input className="mb-[9px] box-border h-[46px] w-full rounded-[9px] border border-[#dbe2ed] bg-white px-3.5 text-sm text-[#1c2940] outline-none placeholder:text-[#9ca7b7] focus:border-[#5363ec] focus:ring-[3px] focus:ring-[rgba(83,99,236,.12)]" id="login-email" name="email" type="email" placeholder="you@company.com" autoComplete="email" required />

            <label className="text-[13px] font-semibold text-[#354158]" htmlFor="login-password">Password</label>
            <div className="relative">
              <input className="mb-[9px] box-border h-[46px] w-full rounded-[9px] border border-[#dbe2ed] bg-white px-3.5 pr-[54px] text-sm text-[#1c2940] outline-none placeholder:text-[#9ca7b7] focus:border-[#5363ec] focus:ring-[3px] focus:ring-[rgba(83,99,236,.12)]" id="login-password" name="password" type={showPassword ? 'text' : 'password'} placeholder="Enter your password" autoComplete="current-password" required />
              <button type="button" className="absolute right-2.5 top-0 h-[46px] border-0 bg-transparent text-[11px] font-semibold text-[#5a67d8]" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? 'Hide' : 'Show'}</button>
            </div>

            <div className="mb-3 flex items-center justify-between text-[13px] text-[#71809a]">
              <label className="flex items-center gap-2"><input className="m-0 h-4 w-4 accent-[#4e4fe1]" type="checkbox" name="remember" />Remember me</label>
              <button className="border-0 bg-transparent p-0 font-semibold text-[#4d46df]" type="button">Forgot password?</button>
            </div>

            {(error || apiError) && <p className="my-0 text-xs text-[#c44848]" role="alert">{error || apiError}</p>}
            {submitted && <p className="my-0 text-xs text-[#2c8a68]" role="status">Signed in successfully.</p>}
            <button className="mt-1 h-[46px] rounded-[9px] border-0 bg-[#4d46df] text-[13px] font-bold text-white shadow-[0_8px_18px_rgba(77,70,223,.2)] transition hover:-translate-y-px hover:bg-[#3f38cf] disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={isLoading}>{isLoading ? 'Signing in...' : 'Sign in'} <span className="ml-2 text-[17px]" aria-hidden="true">→</span></button>
          </form>

          <p className="mt-[23px] text-center text-[13px] text-[#7a879d]">Don't have an account? <Link className="font-bold text-[#4d46df]" to="/register">Create one</Link></p>
        </div>
      </section>
    </main>
  )
}

export default Login
