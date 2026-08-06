import { useState } from 'react';

export function usePasswordToggle() {
  const [show, setShow] = useState(false);
  const toggle = () => setShow(prev => !prev);
  return [show, toggle];
}