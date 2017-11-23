import React, { Component } from 'react';
import $ from "jquery";

import "./css/pure.css"
import "./App.css";

import Calibrator from "./Calibrator";
import magic from "./magic";

class App extends Component {
  constructor() {
    super();
    this.state = {lastTimestamp : 0, lastValue : 0, failed : false, busy : false, defaultSamples : 5, canSave : false, recs : [], calibrating : false, calibrated : false};
  var calibrated = window.localStorage.getItem('calibrated');
    if (calibrated) {
      var vals = JSON.parse(window.localStorage.getItem('calibrationValues'));
      this.state.calibrated = true;
      this.state.calibrationValues = vals;
      window.doMagic = function(i) {
        var cv = [].concat(vals);
        return magic(cv,i);
      }
    }
    this.backendURL = 'http://localhost:9909';
  }

  performScan(samples,ccb, cecb) {
    var params = {samples : samples};
    this.setState({busy : true});
    $.ajax({
      timeout: 22000,
      url : this.backendURL + '/scan',
      method : 'GET',
      data : params,
      success : (data) => {
        console.log(data);
        if (typeof ccb !== 'function') {
          this.setState({lastTimestamp : data.timestamp, lastValue : data.value, failed : false, canSave : true, recs : data.records});
        } else {
          ccb(data);
        }
      },
      error : (fail) => {
        console.log(fail);
        if (typeof cecb !== 'function') {
          this.setState({lastTimestamp : Date.now(), lastValue : -1, failed : true, recs : []});
        } else {
          cecb(fail)
        }
      },
      complete : () => {
        this.setState({busy : false});
      }
    })
  }

  cancelCalibration() {
    this.setState({calibrating : false});
  }

  startCalibration() {
    this.setState({calibrating : true});
  }

  saveCalibration(vals) {
    this.setState({calibrated : true, calibrating : false, calibrationValues : vals});
    window.localStorage.setItem('calibrated', true);
    window.localStorage.setItem('calibrationValues', JSON.stringify(vals));
  }

  render() {
    return (
      <div className="App">
        <header>
          <button className="pure-button pure-button-primary" href="#" onClick={ (e) => this.performScan(this.refs.samples.value)} disabled={this.state.busy || !this.state.calibrated}>Scan</button>
          <label>Samples: <input type="number" min="1" max="25" ref="samples" value={this.state.defaultSamples} onChange={(e) => {this.setState({defaultSamples : e.target.value})}} /></label>
          <button className="pure-button" disabled={this.state.isBusy || this.calibrating} onClick={this.startCalibration.bind(this)}>Calibrate</button>
        </header>
        <main>
          {this.state.busy && ( <div className="loading">LOADING</div>) }
          {!this.state.busy && !this.state.failed && !this.state.calibrating && this.state.lastTimestamp !== 0 && 
              <div className="scan-result-window">{magic(this.state.calibrationValues, this.state.lastValue).toFixed(2)} ng/ul</div>
          }
          {this.state.calibrating && <Calibrator sampleFn={this.performScan.bind(this)} finishFn={this.saveCalibration.bind(this)} cancelFn={this.cancelCalibration.bind(this)}/> }
        </main>
      </div>
    )
  }
}

export default App;
