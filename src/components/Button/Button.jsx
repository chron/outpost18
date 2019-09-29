import React from 'react';
import classNames from 'classnames';
import './Button.scss';

function Button({ reversed, ...otherProps }) {
  return (
    <button
      type="button"
      className={classNames('button', {
        'button--reversed': reversed,
      })}
      {...otherProps}
    />
  );
}

export default Button;
