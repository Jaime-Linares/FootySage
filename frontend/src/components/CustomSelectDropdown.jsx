import React, { useState } from 'react';
import PropTypes from 'prop-types';


const CustomSelectDropdown = ({ options, multi = false, onChange, placeholder = 'Select...', style = {} }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(multi ? [] : null);

  const handleSelect = (option) => {
    if (multi) {
      const updated = selected.some(sel => sel.value === option.value)
        ? selected.filter(sel => sel.value !== option.value)
        : [...selected, option];

      setSelected(updated);
      onChange(updated);
    } else {
      setSelected(option);
      onChange(option);
      setIsOpen(false);
    }
  };

  const removeSelected = (value) => {
    const updated = selected.filter(sel => sel.value !== value);
    setSelected(updated);
    onChange(updated);
  };

  const isSelected = (option) =>
    multi
      ? selected.some(sel => sel.value === option.value)
      : selected?.value === option.value;

  return (
    <div style={{ position: 'relative', width: '20%', ...style }}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: '10px',
          borderRadius: 'var(--border-radius)',
          backgroundColor: 'var(--color-grey-light)',
          fontFamily: 'var(--font-family-base)',
          fontSize: 'var(--font-size-base)',
          cursor: 'pointer',
          userSelect: 'none',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '6px',
          minHeight: '30px',
        }}
      >
        {multi ? (
          selected.length > 0 ? (
            selected.map((s) => (
              <div
                key={s.value}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: 'var(--color-green-select)',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  color: '#fff',
                }}
              >
                {s.image && (
                  <img
                    src={s.image}
                    alt={s.label}
                    style={{ width: '16px', height: '16px', marginRight: '5px', objectFit: 'contain' }}
                  />
                )}
                <span>{s.label}</span>
                <span
                  onClick={(e) => {
                    e.stopPropagation(); 
                    removeSelected(s.value);
                  }}
                  style={{
                    marginLeft: '8px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                  }}
                >
                  ×
                </span>
              </div>
            ))
          ) : (
            <span>{placeholder}</span>
          )
        ) : (
          selected ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {selected.image && (
                <img src={selected.image} alt={selected.label} style={{ width: '20px', height: '20px', objectFit: 'contain' }} />
              )}
              <span>{selected.label}</span>
            </div>
          ) : (
            <span>{placeholder}</span>
          )
        )}
      </div>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            maxHeight: '200px',
            overflowY: 'auto',
            backgroundColor: '#fff',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
            zIndex: 10,
            borderRadius: 'var(--border-radius)',
            marginTop: '5px',
          }}
        >
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => handleSelect(option)}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '10px',
                backgroundColor: isSelected(option) ? 'var(--color-green-select)' : '#fff',
                color: isSelected(option) ? '#fff' : '#000',
                cursor: 'pointer',
                transition: 'background 0.2s ease',
              }}
            >
              {option.image && (
                <img
                  src={option.image}
                  alt={option.label}
                  style={{ width: '24px', height: '24px', marginRight: '10px', objectFit: 'contain' }}
                />
              )}
              <span>{option.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

CustomSelectDropdown.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      image: PropTypes.string,
    })
  ).isRequired,
  multi: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  style: PropTypes.object,
};


export default CustomSelectDropdown;
