import fs from 'node:fs';
import path from 'node:path';
import type { TestInfo } from '@playwright/test';
import { getFileNameDateTime } from './utils';

export async function createTestImage(
  testInfo: TestInfo,
  dateTimeString: string,
) {
  const fileNameDateTime = getFileNameDateTime();

  const randomColor = Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, '0');
  const imageUrl = `https://placehold.co/600x400/${randomColor}/white/png?text=${encodeURIComponent(dateTimeString)}`;

  const imageName = `test-image-${fileNameDateTime}.png`;
  const imagePath = testInfo.outputPath(imageName);

  // 디렉토리 생성
  const dir = path.dirname(imagePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const response = await fetch(imageUrl);
  const buffer = await response.arrayBuffer();
  fs.writeFileSync(imagePath, Buffer.from(buffer));

  return { imagePath, imageName };
}

export function createTestTextFile(testInfo: TestInfo, dateTimeString: string) {
  const fileNameDateTime = getFileNameDateTime();

  const fileName = `test-file-${fileNameDateTime}.txt`;
  const filePath = testInfo.outputPath(fileName);

  // 디렉토리 생성
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(
    filePath,
    `Playwright 테스트 첨부파일
생성 시간: ${dateTimeString}
파일명: ${fileName}`,
  );

  return { filePath, fileName };
}
