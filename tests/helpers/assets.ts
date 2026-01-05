import fs from 'node:fs';
import path from 'node:path';
import type { TestInfo } from '@playwright/test';

export function getKoreanDateTime(): string {
  return new Date().toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

export function getFileNameDateTime(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
}

export async function createTestImage(
  testInfo: TestInfo,
  dateTimeString: string,
  type: 'landscape' | 'portrait' = 'landscape',
): Promise<{ imagePath: string; imageName: string }> {
  const width = type === 'landscape' ? 600 : 450;
  const height = type === 'landscape' ? 400 : 600;
  const color = Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, '0');
  const text = encodeURIComponent(`Test ${dateTimeString}`);
  const url = `https://placehold.co/${width}x${height}/${color}/white?text=${text}`;

  const response = await fetch(url);
  const buffer = await response.arrayBuffer();

  const imageName = `test-${dateTimeString.replace(/[^a-zA-Z0-9]/g, '-')}.png`;
  const imagePath = path.join(testInfo.outputPath(), imageName);
  fs.mkdirSync(path.dirname(imagePath), { recursive: true });
  fs.writeFileSync(imagePath, Buffer.from(buffer));

  return { imagePath, imageName };
}

export function createTestTextFile(
  testInfo: TestInfo,
  dateTimeString: string,
): { filePath: string; fileName: string } {
  const fileName = `test-${dateTimeString.replace(/[^a-zA-Z0-9]/g, '-')}.txt`;
  const filePath = path.join(testInfo.outputPath(), fileName);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `Test file created at ${dateTimeString}`);
  return { filePath, fileName };
}
