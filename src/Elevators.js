import React from 'react';
import Elevator from './Elevator.js';
import Floors from './Floors.js';

const MOVE_FLOOR_TIME = 500;

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
			<div style={{display: "flex"}}>
				<Floors count={floorsCount} callElevator={this.callElevator} />
				<div style={{marginLeft: "50px"}}>
					{elevators.map((elevator, i) =>
						<Elevator {...elevator} index={i} />
					)}
				</div>
			</div>
		);
	}

	callElevator = (floor) => {
		let destination = prompt("What floor do you want to go to?", "1");
		destination = parseInt(destination);
	}
	
}
