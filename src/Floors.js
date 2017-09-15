import React from 'react';

export default class Floors extends React.Component {
	render() {
		const { count, callElevator } = this.props;
		const floors = [];

		for (let i = 0; i < count; i++) {
			const floorNo = i+1;
			floors.push(
				<div key={floorNo} style={{marginBottom: "20px"}}>
					Floor #{floorNo}<br />
					<a href="#" onClick={e => callElevator(floorNo)}>Call elevator</a>
				</div>
			);
		}

		return (
			<div>
				{floors}
			</div>
		);
	}
}
