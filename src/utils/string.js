const randomstring = require('randomstring');

// exports.generateRandom = (length = 6) => {
//   return randomstring.generate({length});
// };

// exports.GenerateSecrete = () => {
//   var result = '';
//   var characters =
//     'ABCDEFGHJKMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';
//   var charactersLength = characters.length;
//   for (var i = 0; i < 23; i++) {
//     result += characters.charAt(Math.floor(Math.random() * charactersLength));
//   }
//   return result;
// };

exports.GenerateOtp = () => {
  const random = randomstring.generate({
    length: 6,
    charset: 'numeric'
  });
  return random;
};

exports.generateAmount = () => {
  const random = randomstring.generate({
    length: 3,
    charset: 'numeric'
  });
  return '2' + random;
};
exports.generateFIATRef = () => {
  const random = randomstring.generate({
    length: 20,
    charset: 'alphanumeric',
    capitalization: 'uppercase'
  });

  return 'PAYPEPP' + random;
};



// exports.GenearteSMSToken = () => {
//   var result = '';
//   var characters =
//     'ABCDEFGHJKMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//   var charactersLength = characters.length;
//   for (var i = 0; i < 8; i++) {
//     result += characters.charAt(Math.floor(Math.random() * charactersLength));
//   }
//   return result;
// };



// exports.generateOrderRef = () => {
//   const random = randomstring.generate({
//     length: 7,
//     charset: 'alphanumeric',
//     capitalization: 'uppercase'
//   });

//   return 'CHATSQRC' + random;
// };

exports.generateTransactionRef = () => {
  return randomstring.generate({
    length: 10,
    charset: 'numeric'
  });
};

// exports.generateOrganisationId = () => {
//   const random = randomstring.generate({
//     length: 7,
//     charset: 'alphanumeric',
//     capitalization: 'uppercase'
//   });
//   return `CHATSORG${random}`;
// };

exports.generateRideRef = () => {
  const random = randomstring.generate({
    length: 7,
    charset: 'alphanumeric',
    capitalization: 'uppercase'
  });

  return `RID${random}`;
};


