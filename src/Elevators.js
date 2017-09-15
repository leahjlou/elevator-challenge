import React from 'react';
import Elevator from './Elevator.js';
import Floors from './Floors.js';

const MOVE_FLOOR_TIME = 500;
const OPEN_DOOR_TIME = 500;
const TRIP_LIMIT_BEFORE_MAINTENANCE = 100;

export default class Elevators extends React.Component {
	state = {
		elevators: [],
	}

	componentWillMount() {
		this.initializeElevators();
	}

	render() {
		const { count, floorsCount } = this.props;
		const { elevators } = this.state;

		return (
			<div style={{display: "flex"}}>
				<Floors count={floorsCount} callElevator={this.callElevator} />
				<div style={{marginLeft: "50px"}}>
					{elevators.map((elevator) =>
						<Elevator key={elevator.index} {...elevator} />
					)}
				</div>
			</div>
		);
	}

	initializeElevators = () => {
		this.setState({
			elevators: new Array(this.props.count).fill({}).map((item, index) => ({
				index: index,
				currentFloor: 1,
				open: false,
				movingDirection: false,
				tripCount: 0,
				floorsPassed: 0,
				maintenance: false,
			})),
		});
	}

	callElevator = (floor) => {
		let destination = prompt("What floor do you want to go to?", "1");
		destination = parseInt(destination);
		if (destination < 1 || destination > this.props.floorsCount) {
			alert("Invalid floor entered.");
			return;
		}

		// Choose which elevator to use
		const elevator = this.getCalledElevator(floor);

		// Move the elevator
		this.moveElevator(elevator, destination);
	}

	getCalledElevator = floor => {
		const workingElevators = this.state.elevators.filter(elevator => !elevator.maintenance);

		// First priority: if an elevator is stopped at the floor calling
		const unoccupiedAtFloor = workingElevators.find(elevator =>
			!elevator.movingDirection && elevator.currentFloor === floor
		);
		if (unoccupiedAtFloor) return unoccupiedAtFloor;

		// Second priority: if a moving elevator is going to pass
		const willPass = workingElevators.find(elevator =>
			elevator.movingDirection &&
			(elevator.movingDirection === "up" && elevator.currentFloor <= floor) ||
			(elevator.movingDirection === "down" && elevator.currentFloor >= floor)
		);
		if (willPass) return willPass;

		const firstUnoccupied = workingElevators.find(elevator => !elevator.movingDirection);

		// Third priority: unoccupied elevator closest to it
		const closest = workingElevators.reduce((closest, elevator) => {
			const floorsBetween = Math.abs(elevator.currentFloor - floor);
			const currFloorsBetween = Math.abs(closest.currentFloor - floor);
			return (floorsBetween < currFloorsBetween) ? elevator : closest;
		}, firstUnoccupied);
		if (closest) return closest;

		alert("Sorry, no elevators are currently available.");
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
			// Done moving, reached destination, open and close doors and update data
			const newTripCount = elevator.tripCount + 1;
			this.updateElevatorData(elevator.index, {
				open: true,
				tripCount: newTripCount,
				floorsPassed: elevator.floorsPassed + floorsToMove,
				movingDirection: false,
				maintenance: (newTripCount >= TRIP_LIMIT_BEFORE_MAINTENANCE),
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
			setTimeout(() => {
				floor = direction === "up" ? floor + 1 : floor - 1;
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
