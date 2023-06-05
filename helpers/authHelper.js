const bcrypt = require("bcrypt"); //bcrypt is a library which helps us to hash the password

exports.hashPassword = async (password) => {
  try {
    const saltRound = 10;
    const hashedPassword = await bcrypt.hash(password, saltRound);
    return hashedPassword;
  } catch (err) {
    console.log(err);
  }
};

exports.comparePassword = async (password, hashedPassword) => {
  const match = await bcrypt.compare(password, hashedPassword);
  // console.log(match);  //hence it proved that this match or the above function returns boolean
  return match;
};
