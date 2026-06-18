import { Module } from '@nestjs/common';
import { BcryptHasher } from './bcrypt-hasher';
import { JwtEncrypter } from './jwt-encrypter';

import { Encrypter } from '@/core/cryptography/encrypter';
import { HashComparer } from '@/core/cryptography/hash-comparer';
import { HashGenerator } from '@/core/cryptography/hash-generator';

@Module({
  providers: [
    { provide: Encrypter, useClass: JwtEncrypter },
    { provide: HashComparer, useClass: BcryptHasher },
    { provide: HashGenerator, useClass: BcryptHasher },
  ],
  exports: [Encrypter, HashComparer, HashGenerator],
})
export class CryptographyModule {}
