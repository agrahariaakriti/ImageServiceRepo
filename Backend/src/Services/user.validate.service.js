export const emailValidation = (email) => {
  console.log("hyy in the email validaor", email);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const usernameValidation = (username) => {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
};

export const passwordValidation = (password) => {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/; 
  return passwordRegex.test(password);
};
