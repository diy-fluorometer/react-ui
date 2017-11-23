import React, { Component } from 'react';

class Calibrator extends Component {
  constructor() {
    super();
    this.state={vals : [-1,-1,-1,-1], finished : false};
  }
  render() {
    return (
      <div>
        <div style={{'width' : '50%', 'float' : 'left'}}>
          <div><button className="pure-button" style={{'width' : '280px'}} onClick={(e) => {this.takeSample(0)}}>Take blank</button> value :  {this.state.vals[0]}</div>
          <div><button className="pure-button" style={{'width' : '280px'}} onClick={(e) => {this.takeSample(1)}}>Take sample 1</button>value : {this.state.vals[1]}</div>
          <div><button className="pure-button" style={{'width' : '280px'}} onClick={(e) => {this.takeSample(2)}}>Take sample 2</button>value : {this.state.vals[2]}</div>
          <div><button className="pure-button" style={{'width' : '280px'}} onClick={(e) => {this.takeSample(3)}}>Take sample 3</button>value : {this.state.vals[3]}</div>
        </div>
        <div>
          <div><button className="pure-button btn-ok" style={{'width' : '200px'}} disabled={!this.state.finished} onClick={(e) => {this.props.finishFn(this.state.vals)}}>Save</button></div>
          <div><button className="pure-button btn-danger" style={{'width' : '200px'}} onClick = { (e) => {this.props.cancelFn()} } >Cancel</button></div>
        </div>
      </div>
    )
  }
  takeSample(i) {
    this.props.sampleFn(1,
      (data) => {
        var nv = [].concat(this.state.vals);
        nv[i] = data.value;
        this.setState({vals : nv});
        if (this.state.vals.indexOf(-1) === -1) {
          this.setState({finished : true});
        }
      },
      (error) => {
        window.alert('failed to get sample');
      }
    );
  }
}

export default Calibrator
