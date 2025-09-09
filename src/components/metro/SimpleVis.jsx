import React, {Component} from 'react';
import {Container} from 'reactstrap'
class SimpleVis extends Component {
    state = { 
        radius: 50,
        height: 150
    }

    constructor(props)
    {
        super(props);
        this.myRef = React.createRef();
        this.elementRefs = [];
    }
    setActive(idx)  {
        if (this.lastEl) {
           this.lastEl.classList.remove('active')
        }

        // belts and braces 
        if (idx < this.props.beats && this.elementRefs[idx] && this.elementRefs[idx].current) {
            let el = this.elementRefs[idx].current;
            el.classList.add('active')
            this.lastEl = el;
        }
    }

    componentDidUpdate() {
        // reposition elements
        const width = this.myRef.current.offsetWidth;

        let radDelta = 2*Math.PI / this.props.beats;

        for (let i = 0 ; i < this.props.beats ; i++) {
            let x =  this.state.radius * Math.sin(radDelta * i);
            let y =  -this.state.radius * Math.cos(radDelta * i);
     
            if (this.elementRefs[i] && this.elementRefs[i].current) {
                this.elementRefs[i].current.style.position = 'absolute';
                this.elementRefs[i].current.style.left =  - 20 + width/2 + x + 'px';  // hardcoded numbers determined visually
                this.elementRefs[i].current.style.top = 50 +  y + 'px';
            }
        }   
    }

    renderCells(cell) {
        let o = [];
        // Ensure we have enough refs for all beats
        while (this.elementRefs.length < this.props.beats) {
            this.elementRefs.push(React.createRef());
        }
        
        for (let i = 0 ; i < this.props.beats ; i++) {
            o.push(<div key={i} ref={this.elementRefs[i]}>{i+1}</div>);
        }
        return o
    }

    render() {  
        return (
        <Container>
            <div ref={this.myRef} className="SimpleVis" style={{ height: this.state.height}}>{this.renderCells()}</div>
        </Container>);
    }
}
 
export default SimpleVis; 

SimpleVis.defaultProps = {
    beats: 4
}
