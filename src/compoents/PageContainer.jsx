import { TransitionGroup, CSSTransition } from 'react-transition-group';

export default (props) => {
  const { children, location } = props;
  return (
    <TransitionGroup>
      <CSSTransition
        key={location.key}
        classNames="fade"
        timeout={300}
      >
        {children}
      </CSSTransition>
    </TransitionGroup>
  );
};
