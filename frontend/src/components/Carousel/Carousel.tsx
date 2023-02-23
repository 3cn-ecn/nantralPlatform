import { ChevronLeftRounded, ChevronRightRounded } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import * as React from 'react';
import './Carousel.scss';

function loopSlice(arr: Array<any>, a: number, b: number): Array<any> {
  const l = arr.length;
  console.log(a, b);
  return arr
    .slice(Math.min(a, 0) + l, l)
    .concat(
      arr
        .slice(Math.max(0, a), Math.min(b, l))
        .concat(arr.slice(0, Math.max(b - l, 0)))
    );
}

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

  const [currentIndex, setCurrentIndex] = React.useState(
    infiniteLoop ? itemNumber : 0
  );
  const [length, setLength] = React.useState(children.length);
  const [translateValue, setTranslateValue] = React.useState<number>(100);

  const [isRepeating, setIsRepeating] = React.useState(
    infiniteLoop && children.length > itemNumber
  );
  const [transitionEnabled, setTransitionEnabled] = React.useState(true);

  const [touchPosition, setTouchPosition] = React.useState(null);

  // Set the length to match current children from props
  React.useEffect(() => {
    setLength(children.length);
    if (length > 0 && currentIndex > length - itemNumber) {
      setCurrentIndex(0);
    }
    setTransitionEnabled(false);
    setIsRepeating(infiniteLoop && children.length > itemNumber);
  }, [children, infiniteLoop, itemNumber]);

  React.useEffect(() => {
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
          isRepeating
            ? (prevState + 1 + length) % length
            : Math.min(length - itemNumber, prevState + 1)
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
        setCurrentIndex((prevState) =>
          isRepeating
            ? (prevState - 1 + length) % length
            : Math.max(0, prevState - 1)
        );
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
      <div className="carousel-top">
        <IconButton disabled={!isRepeating && currentIndex <= 0} onClick={prev}>
          <ChevronLeftRounded />
        </IconButton>
        <h1 className="section-title" style={{ margin: 0 }}>
          {title}
        </h1>
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
              // overflow: 'hidden',
              width: `${100 / itemNumber}%`,
              transform: `translateX(-${translateValue}%)`,
              transition: !transitionEnabled ? 'none' : `${transition}ms`,
            }}
            onTransitionEnd={() => handleTransitionEnd()}
          >
            {children[(currentIndex - 1 + length) % length]}
            {children.slice(
              currentIndex,
              Math.min(length, currentIndex + itemNumber + 1)
            )}
            {/* // {loopSlice(
            //   children,
            //   currentIndex - 1,
            //   length <= itemNumber ? itemNumber : currentIndex + itemNumber + 1
            // )} */}
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
