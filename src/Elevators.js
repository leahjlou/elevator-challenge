import React from 'react';
import Elevator from './Elevator.js';
import Floors from './Floors.js';

export default class Elevators extends React.Component {
	state = {
		elevators: new Array(this.props.count).fill({
			currentFloor: 1,
			open: false,
			tripCount: 0,
			floorsPassed: 0,
			maintenance: false,
		}),
	}

	render() {
		const { count, floorsCount } = this.props;
		const { elevators } = this.state;

		return (
			<div>
				<Floors count={floorsCount} callElevator={this.callElevator} />
				{elevators.map(elevator =>
					<Elevator data={elevator} />
				)}
			</div>
		);
	}

	callElevator(floor) {
		// Call elevator from the given floor
	}
	
}
