import { DayPicker, type DayPickerProps } from 'react-day-picker';
import { ko } from 'react-day-picker/locale';
import 'react-day-picker/style.css';
import './calendar.css';

interface CalendarProps {
  selected: Date;
  onSelect: (date: Date) => void;
  disabled?: DayPickerProps['disabled'];
}

export default function Calendar({
  selected,
  onSelect,
  disabled,
}: CalendarProps) {
  return (
    <DayPicker
      locale={ko}
      mode="single"
      selected={selected}
      disabled={disabled}
      onSelect={(date) => {
        if (!date) return;
        onSelect(date);
      }}
      className="custom-calendar"
    />
  );
}
