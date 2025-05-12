// utils/validation.js

function validateSignupData(req) {
    const {
      firstName,
      lastName,
      emailId,
      password,
      rollNumber,
      age,
      gender,
      role,
    } = req.body;
  
    if (!firstName || !lastName || !emailId || !password || !rollNumber || !age || !gender || !role) {
      throw new Error("All fields are required.");
    }
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailId)) {
      throw new Error("Invalid email format.");
    }
  
    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters.");
    }
  
    if (!["male", "female", "other"].includes(gender.toLowerCase())) {
      throw new Error("Gender must be 'male', 'female', or 'other'.");
    }
  
    if (!["student", "panel","admin",].includes(role.toLowerCase())) {
      throw new Error("Role must be 'student', 'panel', or 'admin'.");
    }
  
    if (isNaN(parseInt(age)) || age < 10 || age > 100) {
      throw new Error("Age must be a valid number between 10 and 100.");
    }
  
    if (rollNumber.trim().length < 3) {
      throw new Error("Invalid roll number.");
    }
  }
  
  module.exports = {
    validateSignupData,
  };
  