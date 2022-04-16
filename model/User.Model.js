
var User = function(user) {
  this.email = user.email;
  this.name = user.name;
  this.last_login = user.last_login;
  // this.provider = user.provider;
  this.uid = user.userid;
  this.password = user.password; // this is used for the local users [not for Azure AD Auth]
};

User.registerLocalUser = async function(
  name,
  email,
  password
) {
  try {
    const name = name;
    console.log('inserting into database');
    const user = await gRunQueryAsync(
      'INSERT into users(name, email, password, type) values(?,?,?,MD5(?), "V")',
      [name, email, vendor, password]
    );
    User.sendVerificationLinkEmail(displayName, userEmail);

    return user;
  } catch (err) {
    return err;
  }
};

module.exports = User;
