import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';
import type { SortOption } from '~/types/academics';
import type { Course } from '~/types/api/v2/academics';
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
        direction="left"
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
        direction="right"
        onClick={() => scrollHorizontally('right')}
      />
    </div>
  );
}

interface ArrowButtonProps {
  direction: 'left' | 'right';
  onClick: () => void;
}

function ArrowButton({ direction, onClick }: ArrowButtonProps) {
  return (
    <button
      type="button"
      className="opacity-0 duration-300 group-hover:opacity-100"
      onClick={onClick}
    >
      {direction === 'left' ? (
        <ChevronLeft
          className="h-[44px] w-[44px] text-main-orange"
          strokeWidth={1.5}
        />
      ) : (
        <ChevronRight
          className="h-[44px] w-[44px] text-main-orange"
          strokeWidth={1.5}
        />
      )}
    </button>
  );
}
