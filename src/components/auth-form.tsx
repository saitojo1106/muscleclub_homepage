'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { Provider } from '@supabase/supabase-js';

// Form modes
type AuthMode = 'signin' | 'signup' | 'magic_link' | 'reset_password';

// Form field validation
interface FieldError {
  email?: string;
  password?: string;
  confirmPassword?: string;
  fullName?: string;
}

// Component props
interface AuthFormProps {
  /**
   * Initial auth mode
   * @default 'signin'
   */
  initialMode?: AuthMode;
  
  /**
   * Show social login options
   * @default true
   */
  showSocialLogin?: boolean;
  
  /**
   * Logo or icon to display in the form header
   */
  logo?: React.ReactNode;
  
  /**
   * Redirect URL after successful authentication
   * @default '/admin'
   */
  redirectUrl?: string;
  
  /**
   * Additional CSS class for the form container
   */
  className?: string;
  
  /**
   * Callback after successful authentication
   */
  onAuthSuccess?: () => void;
}

export default function AuthForm({
  initialMode = 'signin',
  showSocialLogin = true,
  logo,
  redirectUrl = '/admin',
  className = '',
  onAuthSuccess,
}: AuthFormProps) {
  // Auth context
  const auth = useAuth();
  
  // Form state
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  
  // Status state
  const [errors, setErrors] = useState<FieldError>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Reset form errors when input changes
  useEffect(() => {
    setErrors({});
    setFormError(null);
  }, [email, password, confirmPassword, fullName, mode]);

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Reset states
    setFormError(null);
    setErrors({});
    setSuccess(false);
    
    // Validate form based on mode
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      switch (mode) {
        case 'signin':
          await handleSignIn();
          break;
        case 'signup':
          await handleSignUp();
          break;
        case 'magic_link':
          await handleMagicLink();
          break;
        case 'reset_password':
          await handleResetPassword();
          break;
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Form validation
  const validateForm = (): FieldError => {
    const errors: FieldError = {};
    
    // Validate email
    if (!email) {
      errors.email = 'メールアドレスを入力してください';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = '有効なメールアドレスを入力してください';
    }
    
    // Validate password (except for magic link and reset password)
    if (mode !== 'magic_link' && mode !== 'reset_password') {
      if (!password) {
        errors.password = 'パスワードを入力してください';
      } else if (password.length < 8) {
        errors.password = 'パスワードは8文字以上である必要があります';
      }
    }
    
    // Validate password confirmation (signup only)
    if (mode === 'signup') {
      if (!confirmPassword) {
        errors.confirmPassword = 'パスワード（確認）を入力してください';
      } else if (password !== confirmPassword) {
        errors.confirmPassword = 'パスワードが一致しません';
      }
      
      // Validate full name (signup only)
      if (!fullName.trim()) {
        errors.fullName = '名前を入力してください';
      }
    }
    
    return errors;
  };
  
  // Handle sign in
  const handleSignIn = async () => {
    const result = await auth.signInWithPassword({
      email,
      password,
    });
    
    if (result.error) {
      handleAuthError(result.error);
    } else if (result.success) {
      handleAuthSuccess('ログインしました');
    }
  };
  
  // Handle sign up
  const handleSignUp = async () => {
    const result = await auth.signUp({
      email,
      password,
      full_name: fullName,
    });
    
    if (result.error) {
      handleAuthError(result.error);
    } else if (result.success) {
      if (result.data?.user?.identities?.length === 0) {
        // Email already exists but not confirmed
        setFormError('このメールアドレスは既に登録されています');
      } else if (result.data?.user?.confirmed_at) {
        // User is registered and confirmed
        handleAuthSuccess('登録が完了しました');
      } else {
        // User is registered but needs email confirmation
        setSuccess(true);
        setSuccessMessage('確認用のメールを送信しました。メールをご確認ください。');
      }
    }
  };
  
  // Handle magic link
  const handleMagicLink = async () => {
    const result = await auth.signInWithMagicLink(email);
    
    if (result.error) {
      handleAuthError(result.error);
    } else if (result.success) {
      setSuccess(true);
      setSuccessMessage('マジックリンクを記載したメールを送信しました。メールをご確認ください。');
    }
  };
  
  // Handle reset password
  const handleResetPassword = async () => {
    const result = await auth.resetPassword({ email });
    
    if (result.error) {
      handleAuthError(result.error);
    } else if (result.success) {
      setSuccess(true);
      setSuccessMessage('パスワードリセット用のメールを送信しました。メールをご確認ください。');
    }
  };
  
  // Handle auth error
  const handleAuthError = (error: any) => {
    console.error('Authentication error:', error);
    
    // Map Supabase error messages to

