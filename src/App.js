import React from 'react';
import Elevators from './Elevators.js';

export default class App extends React.Component {
  render() {
		const count = 5;
		const floorsCount = 10;
    return (
			<Elevators count={count} floorsCount={floorsCount} />
    );
  }
}
