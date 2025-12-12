import { useState, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import useAuthStore from "../store/auth.js";
import { useTranslation } from "react-i18next";
import { User, Lock, Mail } from "lucide-react";

const LockScreen = () => {
  const { t } = useTranslation();
  const { signIn, signUp, signInAsGuest, error, clearError } = useAuthStore();
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    repeatPassword: "",
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const lockScreenRef = useRef(null);
  const formRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline();
    tl.from(lockScreenRef.current, {
      opacity: 0,
      duration: 0.5,
    }).from(
      formRef.current,
      {
        y: 50,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
      },
      "-=0.3"
    );
  }, []);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasNumber = /\d/.test(password);

    return {
      isValid: minLength && hasSpecialChar && hasNumber,
      minLength,
      hasSpecialChar,
      hasNumber,
    };
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: null }));
    }
    clearError();
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.email) {
      errors.email = t("errors.emailRequired");
    } else if (!validateEmail(formData.email)) {
      errors.email = t("errors.invalidEmail");
    }

    if (!formData.password) {
      errors.password = t("errors.passwordRequired");
    } else if (isSignUp) {
      const passwordCheck = validatePassword(formData.password);
      if (!passwordCheck.isValid) {
        const issues = [];
        if (!passwordCheck.minLength) issues.push("at least 8 characters");
        if (!passwordCheck.hasSpecialChar) issues.push("one special character");
        if (!passwordCheck.hasNumber) issues.push("one number");
        errors.password = t("errors.passwordWeak");
      }
    }

    if (isSignUp) {
      if (!formData.repeatPassword) {
        errors.repeatPassword = t("errors.confirmPassword");
      } else if (formData.password !== formData.repeatPassword) {
        errors.repeatPassword = t("errors.passwordsDontMatch");
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      let result;
      if (isSignUp) {
        result = await signUp(formData.email, formData.password);
      } else {
        result = await signIn(formData.email, formData.password);
      }

      if (result.success) {
        gsap.to(lockScreenRef.current, {
          opacity: 0,
          scale: 1.1,
          duration: 0.8,
          ease: "power2.in",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setFormData({ email: "", password: "", repeatPassword: "" });
    setValidationErrors({});
    clearError();
  };

  const handleGuestLogin = async () => {
    setIsLoading(true);

    try {
      const result = await signInAsGuest();
      if (result.success) {
        gsap.to(lockScreenRef.current, {
          opacity: 0,
          scale: 1.1,
          duration: 0.8,
          ease: "power2.in",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      ref={lockScreenRef}
      className="fixed inset-0 z-9999 flex items-center justify-center"
      style={{
        background: "rgba(0, 0, 0, 0.6)",
        backdropFilter: "blur(20px)",
      }}
    >
      <div
        ref={formRef}
        className="bg-white/10 backdrop-blur-2xl rounded-3xl p-8 w-[400px] shadow-2xl border border-white/20"
      >
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 rounded-full bg-linear-to-br from-blue-400 to-purple-500 flex items-center justify-center shadow-lg">
            <User size={48} className="text-white" />
          </div>
        </div>

        <h2 className="text-center text-white text-2xl font-semibold mb-2 font-georama">
          {isSignUp ? t("auth.createAccount") : t("auth.welcomeBack")}
        </h2>
        <p className="text-center text-gray-300 text-sm mb-6 font-roboto">
          {isSignUp ? t("auth.signUpMessage") : t("auth.signInMessage")}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder={t("auth.email")}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-10 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
              />
            </div>
            {validationErrors.email && (
              <p className="text-red-400 text-xs mt-1 ml-1">
                {validationErrors.email}
              </p>
            )}
          </div>

          <div>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder={t("auth.password")}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-10 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
              />
            </div>
            {validationErrors.password && (
              <p className="text-red-400 text-xs mt-1 ml-1">
                {validationErrors.password}
              </p>
            )}
          </div>

          {isSignUp && (
            <div>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="password"
                  name="repeatPassword"
                  value={formData.repeatPassword}
                  onChange={handleInputChange}
                  placeholder={t("auth.repeatPassword")}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-10 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                />
              </div>
              {validationErrors.repeatPassword && (
                <p className="text-red-400 text-xs mt-1 ml-1">
                  {validationErrors.repeatPassword}
                </p>
              )}
            </div>
          )}

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
              <p className="text-red-200 text-sm text-center">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading
              ? t("auth.loading")
              : isSignUp
              ? t("auth.signUp")
              : t("auth.signIn")}
          </button>
        </form>

        <div className="mt-4">
          <div className="relative flex items-center justify-center">
            <div className="border-t border-white/20 w-full absolute"></div>
            <span className="bg-white/10 px-3 text-gray-400 text-sm relative">
              OR
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGuestLogin}
          disabled={isLoading}
          className="w-full mt-4 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold py-3 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? t("auth.loading") : t("auth.guest")}
        </button>

        <div className="mt-6 text-center">
          <p className="text-gray-300 text-sm">
            {isSignUp
              ? t("auth.alreadyHaveAccount")
              : t("auth.dontHaveAccount")}{" "}
            <button
              type="button"
              onClick={toggleMode}
              className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
            >
              {isSignUp ? t("auth.signIn") : t("auth.signUp")}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LockScreen;
