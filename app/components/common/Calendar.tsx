import { DayPicker } from 'react-day-picker';
import { ko } from 'react-day-picker/locale';
import 'react-day-picker/style.css';
import './calendar.css';

interface CalendarProps {
  selected: Date;
  onSelect: (date: Date) => void;
  animate?: boolean;
}

export default function Calendar({
  selected,
  onSelect,
  animate = false,
}: CalendarProps) {
  return (
    <DayPicker
      locale={ko}
      animate={animate}
      mode="single"
      selected={selected}
      onSelect={(date) => {
        if (!date) return;
        onSelect(date);
      }}
      className="custom-calendar"
    />
  );
}
