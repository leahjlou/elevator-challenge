import React from 'react';
import Elevator from './Elevator.js';
import Floors from './Floors.js';

const MOVE_FLOOR_TIME = 500;
const OPEN_DOOR_TIME = 500;

export default class Elevators extends React.Component {
	state = {
		elevators: [],
	}

	constructor(props) {
		super();
		this.initializeElevators(props);
	}

	render() {
		const { count, floorsCount } = this.props;
		const { elevators } = this.state;

		return (
			<div style={{display: "flex"}}>
				<Floors count={floorsCount} callElevator={this.callElevator} />
				<div style={{marginLeft: "50px"}}>
					{elevators.map((elevator) =>
						<Elevator {...elevator} />
					)}
				</div>
			</div>
		);
	}

	initializeElevators = props => {
		let i = 0;
		this.setState({
			elevators: new Array(props.count).fill({
				index: i++,
				currentFloor: 1,
				open: false,
				movingDirection: false,
				tripCount: 0,
				floorsPassed: 0,
				maintenance: false,
			}),
		});
	}

	callElevator = (floor) => {
		let destination = prompt("What floor do you want to go to?", "1");
		destination = parseInt(destination);

		// Choose which elevator to use
		const elevator = this.getCalledElevator(floor);

		// Move the elevator
		this.moveElevator(elevator, destination);
	}

	getCalledElevator = floor => {
		// First priority: if an elevator is stopped at the floor calling
		const unoccupiedAtFloor = this.state.elevators.find(elevator =>
				!elevator.movingDirection && elevator.currentFloor === floor
		);
		if (unoccupiedAtFloor) return unoccupiedAtFloor;

		// Second priority: if a moving elevator is going to pass
		const willPass = this.state.elevators.find(elevator =>
			elevator.movingDirection &&
			(elevator.movingDirection === "up" && elevator.currentFloor <= floor) ||
			(elevator.movingDirection === "down" && elevator.currentFloor >= floor)
		);
		if (willPass) return willPass;

		const firstUnoccupied = this.state.elevators.find(elevator => !elevator.movingDirection);
		// TODO: handle case where there are no unoccupied elevators at all, will need to wait

		// Third priority: unoccupied elevator closest to it
		const closest = this.state.elevators.reduce((closest, elevator) => {
			const floorsBetween = Math.abs(elevator.currentFloor - floor);
			const currFloorsBetween = Math.abs(closest.currentFloor - floor);
			return (floorsBetween < currFloorsBetween) ? elevator : closest;
		}, firstUnoccupied);
		if (closest) return closest;
	}

	moveElevator = (elevator, destinationFloor) => {
		const floorDiff = elevator.currentFloor - destinationFloor;
		const movingDirection = (floorDiff > 0) ? "down" : "up";
		this.updateElevatorData(elevator.index, {
			movingDirection,
			open: true,
		});

		// Close door
		setTimeout(() => {
			this.updateElevatorData(elevator.index, {open: false});
		}, OPEN_DOOR_TIME);

		const floorsToMove = Math.abs(floorDiff);
		// Start moving
		this.doMove(elevator, movingDirection, floorsToMove, () => {
			console.log("Done doing move");
			// Reached destination, open and close doors
			this.updateElevatorData(elevator.index, {
				open: true,
				// TODO: increase trips and floors, check maintenance
			});
			// Close door
			setTimeout(() => {
				this.updateElevatorData(elevator.index, {open: false});
			}, OPEN_DOOR_TIME);
		});
	}

	doMove = (elevator, direction, floorsToMove, cb) => {
		let floor = elevator.currentFloor;
		for (let i = 0; i < floorsToMove; i++) {
			floor = direction === "up" ? floor + 1 : floor - 1;
			setTimeout(() => {
				console.log("floor", floor);
				this.updateElevatorData(elevator.index, {currentFloor: floor});
			}, MOVE_FLOOR_TIME*(i+1));
		}

		// Run the callback after all moving is done
		const totalDelay = floorsToMove * MOVE_FLOOR_TIME;
		setTimeout(cb, totalDelay);
	}

	updateElevatorData = (elevatorIndex, newData) => {
		const elevatorsClone = this.state.elevators.slice(0);
		elevatorsClone[elevatorIndex] = {
			...elevatorsClone[elevatorIndex],
			...newData,
		};
		this.setState({
			elevators: elevatorsClone,
		});
	}
	
}
