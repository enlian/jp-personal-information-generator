// src/components/InfoGenerator.tsx
import React, { useState, useEffect } from "react";
import { Faker, faker as defaultFaker, ja } from "@faker-js/faker";


// 创建 Faker 的日语实例
const faker = new Faker({
  locale: [ja],
});

interface PersonInfo {
  nameKanji: string;
  nameKatakana: string;
  address: string;
  postalCode: string;
  phoneNumber: string;
}

const generateJapaneseName = async (): Promise<{ kanji: string; katakana: string; }> => {
  const lastName = faker.person.lastName();
  const firstName = faker.person.firstName();
  return {
    kanji: `${lastName} ${firstName}`,
    katakana:`${lastName} ${firstName}`,
  };
};

const generateAddress = (): string => {
  return `東京都 ${faker.location.city()} ${faker.location.streetAddress()}`;
};

const generatePostalCode = (): string => {
  return faker.location.zipCode("###-####");
};

const generatePhoneNumber = (): string => {
  return faker.phone.number("090-####-####");
};

const InfoGenerator: React.FC = () => {
  const [personInfo, setPersonInfo] = useState<PersonInfo | null>(null);

  const handleGenerate = async() => {
    const { kanji, katakana } = await generateJapaneseName();
    const address = generateAddress();
    const postalCode = generatePostalCode();
    const phoneNumber = generatePhoneNumber();

    setPersonInfo({
      nameKanji: kanji,
      nameKatakana: katakana,
      address,
      postalCode,
      phoneNumber,
    });
  };

  // 在组件挂载时调用 handleGenerate
  useEffect(() => {
    handleGenerate();
  }, []); // 空依赖数组确保只在组件挂载时执行一次

  return (
    <>
      <h4>日本の個人情報ジェネレーター</h4>
      <hr />
      <button onClick={handleGenerate}>個人情報を生成</button>

      {personInfo && (
        <>
          <p>
            <strong>名前（漢字）:</strong> {personInfo.nameKanji}
          </p>
          <p>
            <strong>名前（カタカナ）:</strong> {personInfo.nameKatakana}
          </p>
          <p>
            <strong>住所:</strong> {personInfo.address}
          </p>
          <p>
            <strong>郵便番号:</strong> {personInfo.postalCode}
          </p>
          <p>
            <strong>電話番号:</strong> {personInfo.phoneNumber}
          </p>
        </>
      )}
    </>
  );
};

export default InfoGenerator;
