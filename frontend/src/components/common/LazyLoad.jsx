import { lazy, Suspense } from 'react';
import PropTypes from 'prop-types';
import { useIntersectionObserver } from '../../hooks/useDebounce';
import Spinner from './Spinner';

/**
 * Lazy load wrapper component with intersection observer
 */
const LazyLoad = ({ children, fallback, minHeight = 200 }) => {
  const [ref, isVisible] = useIntersectionObserver();

  return (
    <div ref={ref} style={{ minHeight: isVisible ? 'auto' : minHeight }}>
      {isVisible ? children : fallback || <Spinner className="py-8" />}
    </div>
  );
};

LazyLoad.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.node,
  minHeight: PropTypes.number,
};

/**
 * Lazy component wrapper with Suspense
 */
export const LazyComponent = ({ component: Component, fallback, ...props }) => {
  return (
    <Suspense fallback={fallback || <Spinner className="py-8" />}>
      <Component {...props} />
    </Suspense>
  );
};

LazyComponent.propTypes = {
  component: PropTypes.elementType.isRequired,
  fallback: PropTypes.node,
};

export default LazyLoad;
