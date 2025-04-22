import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';


const CustomSelectDropdown = ({ options, multi = false, onChange, placeholder = 'Select...', style = {}, value }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(value || (multi ? [] : null));
  const [isHovered, setIsHovered] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (value !== undefined) {
      setSelected(value);
    }
  }, [value]);

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

  const removeSelected = (valToRemove) => {
    if (multi) {
      const updated = selected.filter(sel => sel.value !== valToRemove);
      setSelected(updated);
      onChange(updated);
    } else {
      setSelected(null);
      onChange(null);
    }
  };

  const isSelected = (option) =>
    multi
      ? selected.some(sel => sel.value === option.value)
      : selected?.value === option.value;

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ position: 'relative', width: '20%', ...style }}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          padding: '10px',
          borderRadius: 'var(--border-radius)',
          backgroundColor: 'var(--color-grey-light)',
          fontFamily: 'var(--font-family-base)',
          fontSize: 'var(--font-size-base)',
          cursor: 'pointer',
          userSelect: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          flexWrap: 'wrap',
          minHeight: '30px',
          transform: isHovered ? 'scale(1.02)' : 'scale(1)',
          transition: 'transform 0.2s ease-in-out',
        }}
      >
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '6px' }}>
          {multi ? (
            selected.length > 0 ? (
              selected.map((s) => (
                <div
                  key={s.value}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
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
              <span style={{ color: '#888' }}>{placeholder}</span>
            )
          ) : selected ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'var(--color-green-select)',
                padding: '4px 8px',
                borderRadius: '4px',
                color: '#fff',
              }}
            >
              {selected.image && (
                <img
                  src={selected.image}
                  alt={selected.label}
                  style={{ width: '20px', height: '20px', marginRight: '6px', objectFit: 'contain' }}
                />
              )}
              <span>{selected.label}</span>
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  removeSelected(selected.value);
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
          ) : (
            <span style={{ color: '#888' }}>{placeholder}</span>
          )}
        </div>
        <span style={{
          marginLeft: 'auto',
          marginRight: '3px',
          fontSize: '20px',
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.3s ease',
          color: isHovered ? 'var(--color-green)' : '#000',
        }}>
          ▼
        </span>
      </div>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            maxHeight: '250px',
            overflowY: 'auto',
            backgroundColor: '#fff',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
            zIndex: 10,
            borderRadius: 'var(--border-radius)',
            marginTop: '5px',
          }}
        >
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar..."
            style={{
              width: '100%',
              padding: '10px',
              border: 'none',
              borderBottom: '1px solid #ccc',
              fontSize: '14px',
              outline: 'none',
              textAlign: 'center',
              borderTopLeftRadius: 'var(--border-radius)',
              borderTopRightRadius: 'var(--border-radius)',
            }}
          />

          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <div
                key={option.value}
                onClick={() => handleSelect(option)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
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
            ))
          ) : (
            <div style={{ padding: '10px', textAlign: 'center', color: '#888' }}>
              No se encontraron resultados.
            </div>
          )}
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
  value: PropTypes.any,
};


export default CustomSelectDropdown;
