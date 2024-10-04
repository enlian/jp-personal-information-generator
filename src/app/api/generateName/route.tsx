import { NextResponse } from 'next/server';
import kuromoji from 'kuromoji';
import path from 'path';
import fs from 'fs';
import { Faker, faker as defaultFaker, ja } from '@faker-js/faker';

interface GeneratedName {
  kanji: string;
  katakana: string;
}

const faker = new Faker({
  locale: [ja],
});

const generateAddress = (): string => {
  return `東京都 ${faker.location.city()} ${faker.location.streetAddress()}`;
};

const generatePostalCode = (): string => {
  return faker.location.zipCode("###-####");
};

const generatePhoneNumber = (): string => {
  return faker.phone.number("###-####-####");
};

// 生成随机的汉字名字
const generateRandomName = (): { lastName: string; firstName: string } => {
  const lastName = faker.person.lastName(); // 随机生成姓
  const firstName = faker.person.firstName(); // 随机生成名
  return { lastName, firstName };
};

export async function GET() {
  const dictPath = path.resolve('node_modules/kuromoji/dict/base.dat.gz');

  if (!fs.existsSync(dictPath)) {
    console.error('Dictionary file not found:', dictPath);
    return NextResponse.json({ error: 'Dictionary file not found' }, { status: 500 });
  }

  // 生成随机名字
  const { lastName, firstName } = generateRandomName();
  const fullName = `${lastName} ${firstName}`;

  return new Promise((resolve) => {
    kuromoji.builder({ dicPath: path.dirname(dictPath) }).build((err, tokenizer) => {
      if (err) {
        console.error('Error initializing tokenizer:', err);
        return resolve(NextResponse.json({ error: 'Error initializing tokenizer' }, { status: 500 }));
      }

      const tokens = tokenizer.tokenize(fullName);
      const katakanaName = tokens
        .map((token: { reading: any; }) => token.reading || '')
        .join(' ');  // 合并所有的カタカナ表示

      const address = generateAddress();
      const postalCode = generatePostalCode();
      const phoneNumber = generatePhoneNumber();

      return resolve(
        NextResponse.json<GeneratedName & { address: string; postalCode: string; phoneNumber: string }>({
          kanji: fullName,
          katakana: katakanaName,
          address,
          postalCode,
          phoneNumber,
        })
      );
    });
  });
}
