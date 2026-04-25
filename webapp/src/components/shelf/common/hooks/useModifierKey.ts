import { useEffect, useState } from 'react';

export function useModifierKey(key: string): boolean {
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === key) {
        setPressed(true);
      }
    }

    function handleKeyUp(event: KeyboardEvent) {
      if (event.key === key) {
        setPressed(false);
      }
    }

    function handleBlur() {
      setPressed(false);
    }

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, [key]);

  return pressed;
}
