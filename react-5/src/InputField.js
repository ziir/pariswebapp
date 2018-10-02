// @flow

import React from 'react';

type Props = {|
  +className?: string,
  +label: string,
  +value: string,
  +onChange: string => mixed,
|};

export default class InputField extends React.PureComponent<Props> {
  onChange(e: SyntheticInputEvent<HTMLInputElement>) {
    this.props.onChange(e.currentTarget.value.trim());
  }

  render() {
    const { className, label, value } = this.props;
    return (
      <label className={className}>
        {label}:{' '}
        <input type="text" onChange={this.onChange.bind(this)} value={value} />
      </label>
    );
  }
}
