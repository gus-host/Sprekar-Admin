import * as Yup from 'yup';

export const signupValidationSchema = Yup.object().shape({
  // firstName: Yup.string().required('First name is required'),
  // lastName: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  // password: Yup.string().required('Password is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[\W_]/, 'Password must contain at least one special character')
    .required('Password is required'),
});
