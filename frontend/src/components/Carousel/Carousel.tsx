import { ChevronLeftRounded, ChevronRightRounded } from '@mui/icons-material';
import { Button, IconButton } from '@mui/material';
import React, { useEffect, useState } from 'react';
import './Carousel.scss';
/**
 * A custom carousel to display any content
 */
function Carousel(props: {
  /** Items to be displayed */
  children;
  /** Number of item displayed at a time */
  itemNumber: number;
  infiniteLoop?: boolean; // TO DO
  /** Transition duration in ms */
  transition?: number;
  /** Title displayed between navigation arrows */
  title?: string;
}) {
  const { children, itemNumber, infiniteLoop, transition, title } = props;

  const [currentIndex, setCurrentIndex] = useState(
    infiniteLoop ? itemNumber : 0
  );
  const [length, setLength] = useState(children.length);
  const [translateValue, setTranslateValue] = useState<number>(100);

  const [isRepeating, setIsRepeating] = useState(
    infiniteLoop && children.length > itemNumber
  );
  const [transitionEnabled, setTransitionEnabled] = useState(true);

  const [touchPosition, setTouchPosition] = useState(null);

  // Set the length to match current children from props
  useEffect(() => {
    setLength(children.length);
    // if (length > 0 && currentIndex > length - itemNumber) {
    //   setCurrentIndex(length - itemNumber);
    // }
    setTransitionEnabled(false);
    setIsRepeating(infiniteLoop && children.length > itemNumber);
  }, [children, infiniteLoop, itemNumber]);

  useEffect(() => {
    if (isRepeating) {
      if (currentIndex === itemNumber || currentIndex === length) {
        setTransitionEnabled(true);
      }
    }
  }, [currentIndex, isRepeating, itemNumber, length]);

  const next = () => {
    if (isRepeating || currentIndex < length - itemNumber) {
      setTranslateValue(200);
      setTransitionEnabled(true);
      setTimeout(() => {
        setCurrentIndex((prevState) =>
          Math.min(length - itemNumber, prevState + 1)
        );
        setTransitionEnabled(false);
        setTranslateValue(100);
      }, transition);
    }
  };

  const prev = () => {
    if (isRepeating || currentIndex > 0) {
      setTranslateValue(0);
      setTransitionEnabled(true);
      setTimeout(() => {
        setCurrentIndex((prevState) => Math.max(0, prevState - 1));
        setTransitionEnabled(false);
        setTranslateValue(100);
      }, transition);
    }
  };

  const handleTouchStart = (e) => {
    const touchDown = e.touches[0].clientX;
    setTouchPosition(touchDown);
  };

  const handleTouchMove = (e) => {
    const touchDown = touchPosition;

    if (touchDown === null) {
      return;
    }

    const currentTouch = e.touches[0].clientX;
    const diff = touchDown - currentTouch;

    if (diff > 5) {
      next();
    }

    if (diff < -5) {
      prev();
    }

    setTouchPosition(null);
  };

  const handleTransitionEnd = () => {
    if (isRepeating) {
      if (currentIndex === 0) {
        setTransitionEnabled(false);
        setCurrentIndex(length);
      } else if (currentIndex === length + itemNumber) {
        setTransitionEnabled(false);
        setCurrentIndex(itemNumber);
      }
    }
  };

  return (
    <div className="carousel-container">
      <div className="carousel-bottom">
        <IconButton disabled={!isRepeating && currentIndex <= 0} onClick={prev}>
          <ChevronLeftRounded />
        </IconButton>
        <h1 style={{ margin: 0 }}>{title}</h1>
        <IconButton
          disabled={!isRepeating && currentIndex >= length - itemNumber}
          onClick={next}
        >
          <ChevronRightRounded />
        </IconButton>
      </div>
      <div className="carousel-wrapper">
        <div
          className="carousel-content-wrapper"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
        >
          <div
            className="carousel-content"
            style={{
              width: `${100 / itemNumber}%`,
              transform: `translateX(-${translateValue}%)`,
              transition: !transitionEnabled ? 'none' : `${transition}ms`,
            }}
            onTransitionEnd={() => handleTransitionEnd()}
          >
            {currentIndex === 0 && children[children.length - 1]}
            {children.slice(
              Math.max(0, currentIndex - 1),
              currentIndex + itemNumber + 1
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
Carousel.defaultProps = {
  infiniteLoop: false,
  transition: 300,
  title: null,
};

export default Carousel;
