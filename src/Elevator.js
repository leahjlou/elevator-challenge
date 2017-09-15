import React from 'react';

export default class Elevator extends React.Component {
	render() {
		const { index, currentFloor, open, movingDirection, tripCount, floorsPassed, maintenance } = this.props;
		return (
			<div style={{marginBottom: "20px"}}>
				Elevator #{index}<br />
				Current floor: {currentFloor}<br />
				Doors are {open ? "open" : "closed"}<br />
				Elevator is {!movingDirection ? "not moving" : `moving ${movingDirection}`}<br />
				Trips made: {tripCount}<br />
				Floors passed: {floorsPassed}<br />
				In maintenance: {maintenance ? "yes" : "no"}<br />
			</div>
		);
	}
}
