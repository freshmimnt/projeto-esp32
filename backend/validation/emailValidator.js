const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const compileLexYacc = () => {
  const lexFile = path.join(__dirname, 'email.l');
  const yaccFile = path.join(__dirname, 'email.y');
  
  exec(`flex ${lexFile}`, (error) => {
    if (error) {
      console.error('Error compiling Lex file:', error);
      return;
    }
    
    exec(`bison -d ${yaccFile}`, (error) => {
      if (error) {
        console.error('Error compiling Yacc file:', error);
        return;
      }
      
      exec('gcc lex.yy.c y.tab.c -o email_validator', (error) => {
        if (error) {
          console.error('Error compiling C program:', error);
        }
      });
    });
  });
};

const validateEmail = (email) => {
  return new Promise((resolve, reject) => {
    const validatorPath = path.join(__dirname, 'email_validator');
    
    const tempFile = path.join(__dirname, 'temp_email.txt');
    fs.writeFileSync(tempFile, email);
    
    exec(`${validatorPath} < ${tempFile}`, (error, stdout, stderr) => {
      fs.unlinkSync(tempFile);
      
      if (error) {
        resolve(false); 
      } else {
        resolve(true); 
      }
    });
  });
};

module.exports = {
  compileLexYacc,
  validateEmail
}; 