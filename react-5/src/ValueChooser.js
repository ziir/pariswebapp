// @flow

import React from 'react';
import cx from 'classnames';

import './ValueChooser.css';

type Props<T> = {|
  +label: string,
  +values: $ReadOnlyArray<T | null>,
  +selectedValue: T | null,
  +onChange: (T | null) => mixed,
|};

export default class ValueChooser<
  T: number | string
> extends React.PureComponent<Props<T>> {
  handleClick(value: T | null) {
    this.props.onChange(value);
  }

  render() {
    const { label, values, selectedValue } = this.props;

    return (
      <nav className="ValueChooser">
        <span>{label}</span>
        <div>
          {values.map(value => (
            <button
              type="button"
              className={cx('ValueChooser-button', {
                'ValueChooser-button_selected': value === selectedValue,
              })}
              onClick={this.handleClick.bind(this, value)}
            >
              {value === null ? 'Sans filtre' : value}
            </button>
          ))}
        </div>
      </nav>
    );
  }
}
