import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, addDays, subDays } from "date-fns";
import { useRef, useState, useEffect } from "react";

interface DateOption {
  date: Date;
  dayName: string;
  dayNumber: string;
}

interface DatePickerProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export function DatePicker({ selectedDate, onDateChange }: DatePickerProps) {
  const [dateOptions, setDateOptions] = useState<DateOption[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Generate date options (3 days before and 3 days after selected date)
  useEffect(() => {
    const options: DateOption[] = [];
    for (let i = -3; i <= 3; i++) {
      const date = i === 0 ? selectedDate : (i < 0 ? subDays(selectedDate, Math.abs(i)) : addDays(selectedDate, i));
      options.push({
        date,
        dayName: format(date, "E"),
        dayNumber: format(date, "d"),
      });
    }
    setDateOptions(options);
  }, [selectedDate]);

  // Scroll to center when selectedDate changes
  useEffect(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current;
      const centerItem = scrollContainer.querySelector('[data-selected="true"]');
      if (centerItem) {
        const containerWidth = scrollContainer.clientWidth;
        const itemWidth = centerItem.clientWidth;
        const centerPosition = centerItem.getBoundingClientRect().left + itemWidth / 2;
        const containerCenter = scrollContainer.getBoundingClientRect().left + containerWidth / 2;
        const scrollLeft = scrollContainer.scrollLeft + (centerPosition - containerCenter);
        
        scrollContainer.scrollTo({
          left: scrollLeft,
          behavior: 'smooth',
        });
      }
    }
  }, [dateOptions]);

  const handlePrevDay = () => {
    onDateChange(subDays(selectedDate, 1));
  };

  const handleNextDay = () => {
    onDateChange(addDays(selectedDate, 1));
  };

  return (
    <div className="flex items-center mb-6 space-x-2">
      <button
        onClick={handlePrevDay}
        className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-surface-variant text-on-surface-variant hover:bg-primary hover:text-white transition-colors"
        aria-label="Previous day"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      
      <div
        ref={scrollRef}
        className="flex-1 overflow-x-auto flex space-x-3 pb-2 scrollbar-hide"
      >
        {dateOptions.map((option, index) => (
          <button
            key={option.date.toString()}
            className="flex flex-col items-center min-w-[50px]"
            onClick={() => onDateChange(option.date)}
            data-selected={format(selectedDate, 'yyyy-MM-dd') === format(option.date, 'yyyy-MM-dd')}
          >
            <span className="text-xs text-on-surface-variant mb-1">{option.dayName}</span>
            <span
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm ${
                format(selectedDate, 'yyyy-MM-dd') === format(option.date, 'yyyy-MM-dd')
                  ? 'bg-primary text-white'
                  : 'bg-surface-variant text-on-surface'
              }`}
            >
              {option.dayNumber}
            </span>
          </button>
        ))}
      </div>
      
      <button
        onClick={handleNextDay}
        className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-surface-variant text-on-surface-variant hover:bg-primary hover:text-white transition-colors"
        aria-label="Next day"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
