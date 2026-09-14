import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './CustomDatePicker.css';

const CustomDatePicker = ({
  selected,
  onChange,
  placeholderText,
  minDate,
  maxDate,
  name,
  required,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`custom-datepicker-wrapper ${className} ${isOpen ? 'is-active' : ''}`}>
      <FaCalendarAlt className="calendar-icon" />
      <DatePicker
        selected={selected}
        onChange={onChange}
        onCalendarOpen={() => setIsOpen(true)}
        onCalendarClose={() => setIsOpen(false)}
        placeholderText={placeholderText}
        minDate={minDate}
        maxDate={maxDate}
        name={name}
        required={required}
        dateFormat="dd/MM/yyyy"
        className="custom-datepicker-input"
        calendarClassName="custom-calendar-popup"
        popperPlacement="bottom-start"
        autoComplete="off"
        onFocus={(e) => e.target.readOnly = true}
        onChangeRaw={(e) => e.preventDefault()}

        // Custom Header for cleaner navigation
        renderCustomHeader={({
          date,
          changeYear,
          changeMonth,
          decreaseMonth,
          increaseMonth,
          prevMonthButtonDisabled,
          nextMonthButtonDisabled,
        }) => (
          <div className="custom-datepicker-header">
            <button
              type="button"
              className="nav-btn prev"
              onClick={decreaseMonth}
              disabled={prevMonthButtonDisabled}
            >
              <FaChevronLeft />
            </button>
            <div className="current-month-display">
              {date.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </div>
            <button
              type="button"
              className="nav-btn next"
              onClick={increaseMonth}
              disabled={nextMonthButtonDisabled}
            >
              <FaChevronRight />
            </button>
          </div>
        )}

        popperModifiers={[
          {
            name: "offset",
            options: {
              offset: [0, 10],
            },
          },
          {
            name: "preventOverflow",
            options: {
              boundary: "viewport",
            },
          },
        ]}
      />
    </div>
  );
};

export default CustomDatePicker;
