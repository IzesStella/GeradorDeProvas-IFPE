import bcrypt from 'bcryptjs';

const senha = process.argv[2];
if (!senha) {
  console.error('Informe a senha: npm run gerar-hash -- "sua-senha"');
  process.exit(1);
}

console.log(await bcrypt.hash(senha, 12));
