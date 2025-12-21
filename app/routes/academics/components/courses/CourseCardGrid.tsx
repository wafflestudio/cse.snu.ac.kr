import { useRef } from 'react';
import type { SortOption } from '~/types/academics';
import type { Course } from '~/types/api/v2/academics/courses';
import CourseCard from './CourseCard';

interface CourseCardsProps {
  courses: Course[][];
  selectedOption: SortOption;
}

export default function CourseCardGrid({
  courses,
  selectedOption,
}: CourseCardsProps) {
  if (courses.length === 0) return null;
  return (
    <div className="mt-6 flex flex-col gap-8">
      {courses.map((courseRow, i) => (
        <CourseRow
          courses={courseRow}
          selectedOption={selectedOption}
          key={i}
        />
      ))}
    </div>
  );
}

interface CourseRowProps {
  courses: Course[];
  selectedOption: SortOption;
}

const SCROLL_DISTANCE = 400;

function CourseRow({ courses, selectedOption }: CourseRowProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  if (courses.length === 0) return null;

  const scrollHorizontally = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return;
    const currPos = carouselRef.current.scrollLeft;
    carouselRef.current?.scrollTo({
      left:
        currPos + (direction === 'left' ? -SCROLL_DISTANCE : SCROLL_DISTANCE),
      behavior: 'smooth',
    });
  };

  return (
    <div className="group flex items-center">
      <ArrowButton
        iconName="navigate_before"
        onClick={() => scrollHorizontally('left')}
      />
      <div
        className="no-scrollbar overflow-x-auto overflow-y-hidden py-3"
        ref={carouselRef}
      >
        <div className="flex gap-5">
          {courses.map((course) => (
            <CourseCard
              course={course}
              selectedOption={selectedOption}
              key={course.code}
            />
          ))}
        </div>
      </div>
      <ArrowButton
        iconName="navigate_next"
        onClick={() => scrollHorizontally('right')}
      />
    </div>
  );
}

interface ArrowButtonProps {
  iconName: string;
  onClick: () => void;
}

function ArrowButton({ iconName, onClick }: ArrowButtonProps) {
  return (
    <button
      type="button"
      className="opacity-0 duration-300 group-hover:opacity-100"
      onClick={onClick}
    >
      <span className="material-symbols-rounded text-[44px] font-light text-main-orange">
        {iconName}
      </span>
    </button>
  );
}
