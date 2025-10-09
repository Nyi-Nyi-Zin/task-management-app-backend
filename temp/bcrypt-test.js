const bcrypt = require('bcrypt');
const bcryptjs = require('bcryptjs');

(async () => {
  const password = 'Password123!';

  const hash1 = await bcrypt.hash(password, 10);
  const cmp1 = await bcrypt.compare(password, hash1);
  const cmp1b = await bcryptjs.compare(password, hash1);

  const hash2 = await bcryptjs.hash(password, 10);
  const cmp2 = await bcrypt.compare(password, hash2);
  const cmp2b = await bcryptjs.compare(password, hash2);

  console.log('bcrypt hash -> bcrypt.compare:', cmp1);
  console.log('bcrypt hash -> bcryptjs.compare:', cmp1b);
  console.log('bcryptjs hash -> bcrypt.compare:', cmp2);
  console.log('bcryptjs hash -> bcryptjs.compare:', cmp2b);
})();
