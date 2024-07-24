import React from 'react';

const BlockToTime = ({ blocksLeft }) => {
  const secondsPerBlock = 15;
  const totalSeconds = blocksLeft * secondsPerBlock;

  const years = Math.floor(totalSeconds / (365 * 24 * 60 * 60));
  const months = Math.floor((totalSeconds % (365 * 24 * 60 * 60)) / (30 * 24 * 60 * 60));
  const days = Math.floor((totalSeconds % (30 * 24 * 60 * 60)) / (24 * 60 * 60));
  const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);

  const formatTimePart = (value, unit) => {
    if (value === 1) return `${value} ${unit.slice(0, -1)}`;
    if (value > 1) return `${value} ${unit}`;
    return '';
  };

  const timeParts = [
    formatTimePart(years, 'years'),
    formatTimePart(months, 'months'),
    formatTimePart(days, 'days'),
    formatTimePart(hours, 'hours'),
    formatTimePart(minutes, 'minutes')
  ].filter(Boolean);

  const displayTime = timeParts.length > 0 ? timeParts.join(' ') : 'less than a minute';

  return <span>({displayTime})</span>;
};

export default BlockToTime;