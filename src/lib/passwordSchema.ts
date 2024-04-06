// Minimum 8 characters
const minLengthRegex = /^(?=.{8,}$)/;

// At least one uppercase letter
const uppercaseRegex = /^(?=.*?[A-Z])/;

// At least one lowercase letter
const lowercaseRegex = /^(?=.*?[a-z])/;

// At least one number
const numberRegex = /^(?=.*?[0-9])/;

// At least one special character
const specialCharRegex = /^(?=.*?[#?!@$%^&*-])/;

export {
  minLengthRegex,
  uppercaseRegex,
  lowercaseRegex,
  numberRegex,
  specialCharRegex,
};
