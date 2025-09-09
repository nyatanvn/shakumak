import React, { Component } from "react";
import Slider from "rc-slider";
import { Badge, Button } from "reactstrap";
import EditInPlace from "./EditInPlace"

class AdvancedSlider extends Component {
	editorRef = React.createRef();

	constructor(props) {
		super(props)

		this.state = {
			value: props.value || props.defaultValue || 0,
			btnStep: props.btnStep || 1
		};
	}
	onMinusClick = () => {
		const newValue = this.state.value - this.state.btnStep;
		this.setState({ value: newValue }, () => {
			if (this.props.onChange) this.props.onChange(newValue);
		});
	}

	onPlusClick = () => {
		const newValue = this.state.value + this.state.btnStep;
		this.setState({ value: newValue }, () => {
			if (this.props.onChange) this.props.onChange(newValue);
		});
	}

	onEdit(value) {
		if (value >= this.props.min && value <= this.props.max) {
			this.setState({ value: value }, () => {
				if (this.props.onChange) this.props.onChange(value);
			});
		}
	}

	render() {
		return (
			<>
				<div className="advancedSlider">
					{this.props.disableBtns === true ? '' : <Button size="sm" outline className="inlineBtn" onClick={this.onMinusClick}>-</Button>}
					<Badge
						onClick={this.props.editInPlace ? (e) => this.onBadgeClick(e) : function(){}}
						color="light"
						className={this.props.editInPlace? "clickable" : ''}
					>
						{this.state.value}
						{/* {this.props.badgeFormatter(this.state.value)} */}
					</Badge>
					{this.props.editInPlace ? <EditInPlace ref={this.editorRef} title={this.props.title} value={this.state.value} min={this.props.min} max={this.props.max} onChange={(v) => this.onEdit(v)} /> : ''}
					{this.props.disableBtns === true ? '' : <Button size="sm" outline className="inlineBtn" onClick={this.onPlusClick}>+</Button>}
				</div>
				<div style={{ height: "30px" }}>
					<Slider 
						{...this.props}
						value={this.state.value}
						onChange={(value) => {
							this.setState({ value });
							if (this.props.onChange) this.props.onChange(value);
						}}
						onAfterChange={this.props.onAfterChange}
					/>
				</div>
			</>
		);
	}

	onBadgeClick(e) {
		if (this.editorRef.current) {
			this.editorRef.current.open();
		}
		// TODO attach editorInPlace
	}
}

export default AdvancedSlider;

// inherit props from base class
AdvancedSlider.defaultProps = Object.assign({}, Slider.defaultProps, {
	editInPlace: false,
	title: ''
});