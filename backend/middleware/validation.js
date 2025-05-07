const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };
  
  const validatePassword = (password) => {
    // password to be 8 characters - might change
    return password.length >= 8;
  };
  
  const validateName = (name) => {
    // name -  at least 2 characters and only letters and spaces
    const nameRegex = /^[a-zA-Z\s]{2,}$/;
    return nameRegex.test(name);
  };
  
  const validateRegistration = (req, res, next) => {
    const { name, email, password } = req.body;
  
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
  
    if (!validateName(name)) {
      return res.status(400).json({ message: 'Invalid name format' });
    }
  
    if (!validateEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
  
    if (!validatePassword(password)) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }
  
    next();
  };
  
  const validateLogin = (req, res, next) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
  
    if (!validateEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
  
    next();
  };
  
  module.exports = {
    validateRegistration,
    validateLogin
  }; 