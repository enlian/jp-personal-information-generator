import { NextResponse } from "next/server";
import kuromoji from "kuromoji";
import path from "path";
import fs from "fs";
import { Faker, ja } from "@faker-js/faker";

interface GeneratedName {
  kanji: string;
  katakana: string;
}

const faker = new Faker({
  locale: [ja],
});

function generateRoom() {
  const floor = Math.floor(Math.random() * 5) + 1;
  const room = Math.floor(Math.random() * 6) + 1; // 随机房间号 (1-6)

  // 将层数和房间号拼接成三位数格式
  const roomNumber = floor + "0" + room; // 确保格式为三位数

  return roomNumber;
}

const generateAddress = (): string => {
  return `${faker.location.state()} ${faker.location.city()} ${faker.location.streetAddress()} ${generateRoom()}`;
};

const generatePostalCode = (): string => {
  return faker.location.zipCode("###-####");
};

const generatePhoneNumber = (): string => {
  return faker.phone.number({ style: "national" });
};

const generateRandomName = (): { lastName: string; firstName: string } => {
  const lastName = faker.person.lastName(); // 随机生成姓
  const firstName = faker.person.firstName(); // 随机生成名
  return { lastName, firstName };
};

export async function POST(): Promise<NextResponse> {
  // const dictPath = path.resolve("node_modules/kuromoji/dict/base.dat.gz");
  const dictPath = path.resolve("public/dict/base.dat.gz");

  if (!fs.existsSync(dictPath)) {
    console.error("Dictionary file not found:", dictPath);
    return NextResponse.json(
      { error: "Dictionary file not found" },
      { status: 500 }
    );
  }

  const { lastName, firstName } = generateRandomName();
  const fullName = `${lastName}・${firstName}`;

  return new Promise((resolve) => {
    kuromoji
      .builder({ dicPath: path.dirname(dictPath) })
      .build((err, tokenizer) => {
        if (err) {
          console.error("Error initializing tokenizer:", err);
          return resolve(
            NextResponse.json(
              { error: "Error initializing tokenizer" },
              { status: 500 }
            )
          );
        }

        const katakanaLastName = tokenizer
          .tokenize(lastName)
          .filter((token) => token.reading)
          .map((token) => token.reading)
          .join("");

        const katakanaFirstName = tokenizer
          .tokenize(firstName)
          .filter((token) => token.reading)
          .map((token) => token.reading)
          .join("");

        const address = generateAddress();
        const postalCode = generatePostalCode();
        const phoneNumber = generatePhoneNumber();

        return resolve(
          NextResponse.json<GeneratedName & {
              address: string;
              postalCode: string;
              phoneNumber: string;
            }>(
            {
              kanji: fullName,
              katakana: katakanaLastName + "・" + katakanaFirstName,
              address,
              postalCode,
              phoneNumber,
            },
            {
              headers: {
                "Cache-Control":
                  "no-store, no-cache, must-revalidate, proxy-revalidate",
                Pragma: "no-cache",
                Expires: "0",
              },
            }
          )
        );
      });
  });
}
