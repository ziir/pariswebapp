// @flow

import React from 'react';
import debounce from 'lodash.debounce';

type Props = {|
  +className?: string,
  +label: string,
  +onChange: string => mixed,
|};

type State = {|
  value: string,
|};

export default class InputField extends React.PureComponent<Props, State> {
  state = { value: '' };
  // the debounced callback is set with the leading: true option to
  // avoid an unnnecessary delay in some situations
  // (such as emptying the filter input)
  changeCallback = debounce(this.props.onChange, 500, { leading: true });

  onChange(e: SyntheticInputEvent<HTMLInputElement>) {
    const value = e.currentTarget.value;
    this.setState({ value });
    this.changeCallback(value);
  }

  render() {
    const { className, label } = this.props;
    const { value } = this.state;

    return (
      <label className={className}>
        {label}:{' '}
        <input type="text" onChange={this.onChange.bind(this)} value={value} />
      </label>
    );
  }
}
