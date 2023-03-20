import React from 'react';

/**
 * Function that creates the DayInfos component, which display the hours in the day.
 * @return The DayInfos component.
 */
export function DayInfos() {
  return (
    <div style={{ display: 'block' }}>
      <div style={{ height: '2.5rem' }}></div>
      <p style={{ height: '2.4rem', padding: '0px', margin: '0px' }}>00:00</p>
      <p style={{ height: '2.4rem', padding: '0px', margin: '0px' }}>02:00</p>
      <p style={{ height: '2.4rem', padding: '0px', margin: '0px' }}>04:00</p>
      <p style={{ height: '2.4rem', padding: '0px', margin: '0px' }}>06:00</p>
      <p style={{ height: '2.4rem', padding: '0px', margin: '0px' }}>08:00</p>
      <p style={{ height: '2.4rem', padding: '0px', margin: '0px' }}>10:00</p>
      <p style={{ height: '2.4rem', padding: '0px', margin: '0px' }}>12:00</p>
      <p style={{ height: '2.4rem', padding: '0px', margin: '0px' }}>14:00</p>
      <p style={{ height: '2.4rem', padding: '0px', margin: '0px' }}>16:00</p>
      <p style={{ height: '2.4rem', padding: '0px', margin: '0px' }}>18:00</p>
      <p style={{ height: '2.4rem', padding: '0px', margin: '0px' }}>20:00</p>
      <p style={{ height: '2.4rem', padding: '0px', margin: '0px' }}>22:00</p>
    </div>
  );
}
