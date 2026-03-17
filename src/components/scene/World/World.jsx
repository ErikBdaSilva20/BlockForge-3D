import React from 'react';

export default function World({ children }) {
  return (
    <group name="WorldGroup">
      {children}
    </group>
  );
}
