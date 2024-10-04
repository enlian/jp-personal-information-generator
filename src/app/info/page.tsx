"use client"
import React, { useState,useEffect } from 'react';
import styles from './InfoGenerator.module.scss';

const InfoGenerator = () => {
  const [personInfo, setPersonInfo] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const generateInfo = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/generateName');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setPersonInfo(data);
    } catch (err) {
      setError('Error generating information: ' + err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateInfo();
  }, []);

  return (
    <div className={styles.main}>
      <h4>個人情報ジェネレーター</h4>
      <hr/>
      <button onClick={generateInfo} disabled={loading}>
        {loading ? '生成中...' : '個人情報を生成'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {personInfo && (
        <div>
          <p>
            <strong>名前(漢字): </strong> {personInfo.kanji}
          </p>
          <p>
            <strong>名前(カタカナ): </strong> {personInfo.katakana}
          </p>
          <p>
            <strong>住所: </strong> {personInfo.address}
          </p>
          <p>
            <strong>郵便番号: </strong> {personInfo.postalCode}
          </p>
          <p>
            <strong>電話番号: </strong> {personInfo.phoneNumber}
          </p>
        </div>
      )}
    </div>
  );
};

export default InfoGenerator;
