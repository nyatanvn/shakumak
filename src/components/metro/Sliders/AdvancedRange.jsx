import React, { Component } from "react";
import Slider from "rc-slider";
import { Badge } from "reactstrap";
import RangeEditInPlace from "./RangeEditInPlace";

class AdvancedRange extends Component {
	editorRef = React.createRef();
	
	constructor(props) {
		super(props);
		this.state = {
			bounds: [props.min || 0, props.max || 100]
		};
	}

	onBadgeClick() {
		this.editorRef.current.open();
	}

	onEdit(v) {
		this.setState({ bounds: [v.min, v.max] }, () => this.props.onAfterChange(this.state.bounds))

	}
	render() {
		return (
			<>
				<div>
					<Badge
						color="light"
						onClick={this.props.editInPlace ? () => this.onBadgeClick() : function () { }}
						className={this.props.editInPlace ? "clickable" : ''}
					>
						{this.state.bounds[0]} - {this.state.bounds[1]}
					</Badge>
					<RangeEditInPlace
						ref={this.editorRef}
						title={this.props.title}
						value={{ min: this.state.bounds[0], max: this.state.bounds[1] }}
						min={this.props.min}
						max={this.props.max}
						onChange={(v) => this.onEdit(v)} />
				</div>
				<div style={{ height: "30px" }}>
					<Slider 
						range 
						{...this.props}
						value={this.state.bounds}
						onChange={this.props.onChange}
						onAfterChange={this.props.onAfterChange}
					/>
				</div>
			</>
		);
	}
}

export default AdvancedRange;

// inherit props from base class
AdvancedRange.defaultProps = {
	editInPlace: false,
	title: ''
};