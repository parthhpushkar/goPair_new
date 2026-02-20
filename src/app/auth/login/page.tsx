'use client';

import { useState, useEffect, useRef } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiPhone, FiArrowRight, FiShield, FiCheck } from 'react-icons/fi';
import { HiOutlineSparkles } from 'react-icons/hi2';

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Resend timer countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [resendTimer]);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }

    setLoading(true);
    try {
      const fullPhone = phone.startsWith('+') ? phone : `+91${phone}`;
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: fullPhone }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Failed to send OTP');
        return;
      }

      toast.success('OTP sent to your phone!');
      setStep('otp');
      setResendTimer(30);
      // Focus first OTP input
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // only digits

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // only last digit
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOTPKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOTPPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      const newOtp = pasted.split('');
      setOtp(newOtp);
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerifyOTP = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      toast.error('Please enter the complete 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const fullPhone = phone.startsWith('+') ? phone : `+91${phone}`;

      // Step 1: Verify the OTP
      const verifyRes = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: fullPhone, code: otpCode }),
      });

      const verifyData = await verifyRes.json();

      if (!verifyRes.ok) {
        toast.error(verifyData.error || 'Invalid OTP');
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
        return;
      }

      // Step 2: Sign in with NextAuth
      const result = await signIn('phone-otp', {
        phone: fullPhone,
        code: otpCode,
        redirect: false,
      });

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success(
          verifyData.isNewUser
            ? 'Welcome to goPair! 🎉'
            : 'Welcome back! 👋'
        );

        if (verifyData.isNewUser) {
          router.push('/profile');
        } else {
          router.push('/dashboard');
        }
        router.refresh();
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // Auto-submit when all 6 digits entered
  useEffect(() => {
    if (otp.every((d) => d !== '') && step === 'otp') {
      handleVerifyOTP();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp]);

  const handleResend = async () => {
    if (resendTimer > 0) return;
    setOtp(['', '', '', '', '', '']);
    await handleSendOTP(new Event('submit') as any);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-20">
      {/* Background */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-primary-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-accent-500/8 rounded-full blur-[150px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 md:p-10 w-full max-w-md relative overflow-hidden"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <HiOutlineSparkles className="text-white text-xl" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-white mb-2">
            {step === 'phone' ? 'Login to goPair' : 'Verify OTP'}
          </h1>
          <p className="text-sm text-gray-400">
            {step === 'phone'
              ? 'Enter your phone number to receive an OTP'
              : `We sent a 6-digit code to +91${phone.replace(/^\+91/, '')}`}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {step === 'phone' ? (
            <motion.form
              key="phone-step"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handleSendOTP}
              className="space-y-6"
            >
              {/* Phone Input */}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5 ml-1">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-gray-400">
                    <FiPhone className="text-sm" />
                    <span className="text-sm font-medium text-gray-300 border-r border-white/10 pr-2">+91</span>
                  </div>
                  <input
                    type="tel"
                    value={phone.replace(/^\+91/, '')}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setPhone(val);
                    }}
                    placeholder="9876543210"
                    className="glass-input pl-[5.5rem]"
                    required
                    maxLength={10}
                    autoFocus
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1.5 ml-1">
                  We&apos;ll send you a verification code via SMS
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || phone.replace(/^\+91/, '').length < 10}
                className="glass-button w-full py-3 text-base disabled:opacity-50"
              >
                {loading ? (
                  <motion.div
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  />
                ) : (
                  <>
                    Send OTP <FiArrowRight />
                  </>
                )}
              </button>
            </motion.form>
          ) : (
            <motion.div
              key="otp-step"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* OTP Input Boxes */}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-3 ml-1">
                  Enter 6-digit OTP
                </label>
                <div className="flex gap-2 justify-center" onPaste={handleOTPPaste}>
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => { inputRefs.current[index] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOTPChange(index, e.target.value)}
                      onKeyDown={(e) => handleOTPKeyDown(index, e)}
                      className="w-12 h-14 text-center text-xl font-bold text-white glass-input rounded-xl focus:border-primary-400 focus:ring-1 focus:ring-primary-400/50 transition-all"
                    />
                  ))}
                </div>
              </div>

              {/* Verify Button */}
              <button
                onClick={handleVerifyOTP}
                disabled={loading || otp.some((d) => d === '')}
                className="glass-button w-full py-3 text-base disabled:opacity-50"
              >
                {loading ? (
                  <motion.div
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  />
                ) : (
                  <>
                    <FiShield className="text-lg" />
                    Verify & Login
                    <FiCheck className="text-lg" />
                  </>
                )}
              </button>

              {/* Resend & Change Number */}
              <div className="flex items-center justify-between text-sm">
                <button
                  onClick={() => {
                    setStep('phone');
                    setOtp(['', '', '', '', '', '']);
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ← Change number
                </button>
                <button
                  onClick={handleResend}
                  disabled={resendTimer > 0}
                  className={`${
                    resendTimer > 0
                      ? 'text-gray-600 cursor-not-allowed'
                      : 'text-primary-400 hover:text-primary-300'
                  } transition-colors`}
                >
                  {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Security Note */}
        <div className="mt-6 pt-5 border-t border-white/5">
          <p className="text-center text-xs text-gray-500 flex items-center justify-center gap-1.5">
            <FiShield className="text-primary-400" />
            Your phone number is secured with end-to-end encryption
          </p>
        </div>
      </motion.div>
    </div>
  );
}
