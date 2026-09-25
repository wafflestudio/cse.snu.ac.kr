import clsx from 'clsx';
import type { ReactNode } from 'react';

import styles from './style.module.css';

// orange = 선택된 탭, lightGray = 선택 안 된 탭, summary = 한 대상의 정보 요약 묶음(밝은 회색).
type ColorTheme = 'orange' | 'lightGray' | 'summary';
type Size = 'small' | 'large';
type Shadow = 'light' | 'medium';

interface CornerFoldedRectangleProps {
  colorTheme: ColorTheme;
  size?: Size;
  shadow?: Shadow;
  margin?: string;
  animationType?: 'folding';
  width?: string;
  children: ReactNode;
}

const colorThemeMap: Record<ColorTheme, { rect: string; triangle: string }> = {
  orange: { rect: styles.themeOrange, triangle: styles.triangleOrange },
  lightGray: {
    rect: styles.themeLightGray,
    triangle: styles.triangleLightGray,
  },
  summary: { rect: styles.themeSummary, triangle: styles.triangleSummary },
};

const sizeMap: Record<Size, string> = {
  small: styles.triangleSizeSmall,
  large: styles.triangleSizeLarge,
};

const shadowMap: Record<Shadow, string> = {
  light: styles.shadowLight,
  medium: styles.shadowMedium,
};

export default function CornerFoldedRectangle({
  colorTheme,
  size = 'small',
  shadow = 'medium',
  margin,
  animationType,
  width = 'w-fit',
  children,
}: CornerFoldedRectangleProps) {
  const themeClasses = colorThemeMap[colorTheme];
  const sizeClass = sizeMap[size];
  const shadowClass = shadowMap[shadow];

  if (animationType) {
    return (
      <div
        className={clsx(
          'relative',
          width,
          margin,
          themeClasses.rect,
          styles.animated,
          styles[animationType],
        )}
      >
        {children}
      </div>
    );
  }

  return (
    <div className={clsx('relative', width, margin, themeClasses.rect)}>
      <div className={clsx(styles.triangle, styles.triangleWhite, sizeClass)} />
      <div
        className={clsx(
          styles.triangle,
          themeClasses.triangle,
          sizeClass,
          shadowClass,
        )}
      />
      {children}
    </div>
  );
}
