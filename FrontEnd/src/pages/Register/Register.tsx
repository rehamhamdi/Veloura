import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { registerUser } from "../../features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useI18n } from "../../i18n/I18nProvider";

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const dispatch = useAppDispatch();
  const { error: apiError, isLoading } = useAppSelector((state) => state.auth);
  const { t } = useI18n();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitted(false);

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    const confirmPassword = String(form.get("confirmPassword") ?? "");

    if (password.length < 8) {
      setError(t("register.passwordLength"));
      return;
    }

    if (password !== confirmPassword) {
      setError(t("register.passwordMismatch"));
      return;
    }

    if (!email.includes("@")) {
      setError(t("register.invalidEmail"));
      return;
    }

    try {
      await dispatch(
        registerUser({
          name: String(form.get("fullName") ?? "").trim(),
          email,
          password,
        }),
      ).unwrap();
      setSubmitted(true);
    } catch {
      setSubmitted(false);
    }
  }

  return (
    <main className="grid min-h-screen grid-cols-1 bg-[#f8f3ed] text-[#3b2a29] min-[821px]:grid-cols-[minmax(400px,46%)_1fr]">
      <section
        className="relative flex min-h-[440px] flex-col overflow-hidden bg-[#b9827e] px-[6vw] py-7 text-[#fffaf5] min-[821px]:min-h-0 min-[821px]:px-[6vw] min-[821px]:py-12"
        aria-label={t("login.heroLabel")}
      >
        <div
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(91,55,53,.16),rgba(91,55,53,.48)),url('https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=1200&q=85')] bg-cover bg-center"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-[linear-gradient(90deg,rgba(91,55,53,.58),rgba(91,55,53,.12))]"
          aria-hidden="true"
        />
        <div className="relative z-10 grid h-9 w-9 place-items-center rounded-full border border-[#f3d9d0] bg-[#f3d9d0] text-[17px] font-bold text-[#8e5d5a]">
          <span className="font-['Playfair_Display'] text-[18px]">V</span>
        </div>
        <span className="absolute left-[calc(6vw+48px)] top-9 font-['Playfair_Display'] text-[21px] font-semibold tracking-[.02em] min-[821px]:left-[calc(6vw+48px)] min-[821px]:top-[55px]">
          Veloura
        </span>

        <div className="relative z-10 my-[70px] max-w-[560px] min-[821px]:my-auto">
          <p className="mb-3.5 text-xs font-bold uppercase tracking-[.16em] text-[#f5d9ce]">
            {t("register.heroEyebrow")}
          </p>
          <h1 className="mb-5 max-w-[560px] font-['Playfair_Display'] text-[2.7rem] font-medium leading-[1.06] text-[#fffaf5] min-[481px]:text-[3.1rem] min-[821px]:text-[clamp(2.6rem,3.7vw,4.1rem)]">
            {t("register.heroTitle")}
          </h1>
          <p className="max-w-[480px] text-[15px] leading-[1.75] text-[#f8e8e1]">
            {t("register.heroText")}
          </p>
        </div>

        <blockquote className="relative z-10 m-0 max-w-[330px] border-l border-[#f1d2c8] pl-4 text-[13px] leading-[1.65] text-[#f8e8e1] max-[820px]:hidden">
          <p className="mb-3 italic">"{t("register.quote")}"</p>
          <footer className="text-[11px] uppercase tracking-[.14em] text-[#f2d1c7]">
            {t("login.quoteCaption")}
          </footer>
        </blockquote>
      </section>

      <section className="grid place-items-center px-[8vw] py-[54px] min-[821px]:px-[7vw] min-[821px]:py-[52px]">
        <div className="w-full max-w-[480px]">
          <div className="mb-8">
            <p className="mb-3.5 text-xs font-bold uppercase tracking-[.16em] text-[#a86f6b]">
              A ritual made for you
            </p>
            <h2 className="mb-2 font-['Playfair_Display'] text-[clamp(2rem,3vw,2.55rem)] font-medium leading-[1.15] text-[#3b2a29]">
              {t("register.title")}
            </h2>
            <p className="text-sm text-[#806967]">{t("register.subtitle")}</p>
          </div>

          <form className="grid gap-[9px]" onSubmit={handleSubmit} noValidate>
            <label
              className="text-[13px] font-semibold text-[#5b4240]"
              htmlFor="register-fullName"
            >
              {t("register.fullName")}
            </label>
            <input
              className="mb-[9px] box-border h-[50px] w-full rounded-[13px] border border-[#e3d2c8] bg-[#fffdf9] px-4 text-sm text-[#3b2a29] outline-none placeholder:text-[#b5a09a] focus:border-[#b9827e] focus:ring-[3px] focus:ring-[rgba(185,130,126,.15)]"
              id="register-fullName"
              name="fullName"
              type="text"
              placeholder={t("register.fullName")}
              autoComplete="name"
              required
            />

            <label
              className="text-[13px] font-semibold text-[#5b4240]"
              htmlFor="register-email"
            >
              Email address
            </label>
            <input
              className="mb-[9px] box-border h-[50px] w-full rounded-[13px] border border-[#e3d2c8] bg-[#fffdf9] px-4 text-sm text-[#3b2a29] outline-none placeholder:text-[#b5a09a] focus:border-[#b9827e] focus:ring-[3px] focus:ring-[rgba(185,130,126,.15)]"
              id="register-email"
              name="email"
              type="email"
              placeholder={t("login.emailPlaceholder")}
              autoComplete="email"
              required
            />

            <label
              className="text-[13px] font-semibold text-[#5b4240]"
              htmlFor="register-password"
            >
              {t("login.password")}
            </label>
            <div className="relative">
                  <input
                    className="mb-[9px] box-border h-[50px] w-full rounded-[13px] border border-[#e3d2c8] bg-[#fffdf9] px-4 pr-[54px] text-sm text-[#3b2a29] outline-none placeholder:text-[#b5a09a] focus:border-[#b9827e] focus:ring-[3px] focus:ring-[rgba(185,130,126,.15)] rtl:pr-4 rtl:pl-[54px]"
                    id="register-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={t("register.passwordPlaceholder")}
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-2.5 top-0 grid h-[50px] w-auto place-items-center border-0 bg-transparent text-[#a86f6b] rtl:right-auto rtl:left-2.5"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword
                        ? t("auth.hidePassword")
                        : t("auth.showPassword")
                    }
                    title={
                      showPassword
                        ? t("auth.hidePassword")
                        : t("auth.showPassword")
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={16} strokeWidth={1.7} />
                    ) : (
                      <Eye size={16} strokeWidth={1.7} />
                    )}
                  </button>
            </div>

            {(error || apiError) && (
              <p className="my-0 text-xs text-[#ae4949]" role="alert">
                {error || apiError}
              </p>
            )}
            {submitted && (
              <p className="my-0 text-xs text-[#56806b]" role="status">
                {t("register.success")}
              </p>
            )}
            <button
              className="mt-1 h-[50px] rounded-[13px] border-0 bg-[#6d4946] text-[13px] font-bold text-[#fffaf5] shadow-[0_8px_18px_rgba(109,73,70,.18)] transition hover:-translate-y-px hover:bg-[#583a38] disabled:cursor-not-allowed disabled:opacity-60"
              type="submit"
              disabled={isLoading}
            >
              {isLoading
                ? t("register.creatingAccount")
                : t("register.createAccount")}{" "}
           
            </button>
          </form>

          <p className="mt-[23px] text-center text-[13px] text-[#806967]">
            {t("register.alreadyMember")}{" "}
            <Link className="font-bold text-[#a86f6b]" to="/login">
              {t("register.login")}
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}

export default Register;
