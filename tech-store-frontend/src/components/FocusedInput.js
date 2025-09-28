import React, { useRef, useEffect } from 'react';

const FocusedInput = ({ 
  type = "text", 
  name, 
  value, 
  onChange, 
  placeholder, 
  className = "", 
  rows,
  ...props 
}) => {
  const inputRef = useRef(null);
  const selectionRef = useRef({ start: 0, end: 0 });
  const isTabNavigatingRef = useRef(false);
  const lastValueRef = useRef(value);

  // Detectar navegación por Tab
  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      isTabNavigatingRef.current = true;
      // Limpiar el flag después de un tiempo
      setTimeout(() => {
        isTabNavigatingRef.current = false;
      }, 100);
    }
  };

  const saveSelection = () => {
    if (inputRef.current) {
      selectionRef.current = {
        start: inputRef.current.selectionStart || 0,
        end: inputRef.current.selectionEnd || 0
      };
    }
  };

  const handleChange = (e) => {
    saveSelection();
    lastValueRef.current = e.target.value;
    onChange(e);
  };

  const handleBlur = (e) => {
    // NO restaurar foco si fue por navegación de Tab
    if (isTabNavigatingRef.current) {
      return;
    }

    // NO restaurar foco si el usuario hizo click en otro elemento
    const relatedTarget = e.relatedTarget;
    if (relatedTarget && (
      relatedTarget.tagName === 'BUTTON' ||
      relatedTarget.tagName === 'SELECT' ||
      relatedTarget.tagName === 'INPUT' ||
      relatedTarget.tagName === 'TEXTAREA' ||
      relatedTarget.closest('button, select, [role="button"]')
    )) {
      return;
    }

    // Solo restaurar foco en casos específicos de re-render inesperado
    setTimeout(() => {
      if (inputRef.current && 
          document.activeElement !== inputRef.current &&
          document.activeElement.tagName === 'BODY') {
        inputRef.current.focus();
        try {
          inputRef.current.setSelectionRange(
            selectionRef.current.start, 
            selectionRef.current.end
          );
        } catch (error) {
          // Ignorar errores de selección
        }
      }
    }, 10);
  };

  // Detectar re-renders que causan pérdida de foco
  useEffect(() => {
    // Solo actuar si el valor cambió por un re-render, no por input del usuario
    if (value !== lastValueRef.current && inputRef.current && document.activeElement === inputRef.current) {
      try {
        inputRef.current.setSelectionRange(
          selectionRef.current.start, 
          selectionRef.current.start
        );
      } catch (error) {
        // Ignorar errores
      }
    }
    lastValueRef.current = value;
  }, [value]);

  const inputProps = {
    ref: inputRef,
    name,
    value,
    onChange: handleChange,
    onBlur: handleBlur,
    onKeyDown: handleKeyDown,
    onSelect: saveSelection,
    placeholder,
    className,
    ...props
  };

  if (type === 'textarea') {
    return <textarea rows={rows} {...inputProps} />;
  }

  return <input type={type} {...inputProps} />;
};

export default FocusedInput;
