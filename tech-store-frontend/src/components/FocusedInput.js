// Crear archivo: src/components/FocusedInput.js
import React, { useRef, useEffect } from 'react';

const FocusedInput = ({ 
  type = "text", 
  name, 
  value, 
  onChange, 
  placeholder, 
  className = "", 
  ...props 
}) => {
  const inputRef = useRef(null);
  const lastSelectionStart = useRef(0);
  const lastSelectionEnd = useRef(0);

  // Guardar posición del cursor antes de posibles re-renders
  const handleBeforeInput = () => {
    if (inputRef.current) {
      lastSelectionStart.current = inputRef.current.selectionStart;
      lastSelectionEnd.current = inputRef.current.selectionEnd;
    }
  };

  // Restaurar posición del cursor después del cambio
  const handleChange = (e) => {
    const newValue = e.target.value;
    const cursorPosition = e.target.selectionStart;
    
    // Llamar al onChange del padre
    onChange(e);
    
    // Usar setTimeout para restaurar el foco después del re-render
    setTimeout(() => {
      if (inputRef.current && document.activeElement !== inputRef.current) {
        inputRef.current.focus();
        inputRef.current.setSelectionRange(cursorPosition, cursorPosition);
      }
    }, 0);
  };

  // Efecto para mantener el foco si se pierde inesperadamente
  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    const handleBlur = (e) => {
      // Si el blur no fue intencional (por ejemplo, causado por re-render)
      setTimeout(() => {
        if (document.activeElement !== input && 
            !document.activeElement.closest('.modal') &&
            document.activeElement.tagName !== 'BUTTON') {
          input.focus();
          input.setSelectionRange(lastSelectionStart.current, lastSelectionEnd.current);
        }
      }, 0);
    };

    input.addEventListener('blur', handleBlur);
    return () => input.removeEventListener('blur', handleBlur);
  }, []);

  return React.createElement(type === 'textarea' ? 'textarea' : 'input', {
    ref: inputRef,
    type: type === 'textarea' ? undefined : type,
    name,
    value,
    onChange: handleChange,
    onSelect: handleBeforeInput,
    placeholder,
    className,
    ...props
  });
};

export default FocusedInput;