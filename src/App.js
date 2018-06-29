import React, { Component } from 'react';
import './App.css';
import _ from 'lodash';
// import { range } from 'rambda';

class App extends Component {

  constructor(props) {
    super(props);
    
    this.state = {
      rgb: [],
      weights: [ .99, .55, .01 ] // want these to all eventually become the same thing
    }
  }

  componentDidMount() {
    this.createColors();
  }

  createColors() {
    const rgb = _.range(0, 100)
    .map( e => (
      { 
        r: _.random(0, 255), 
        g: _.random(0, 255), 
        b: _.random(0, 255)
      }
    ))
    this.setState({ rgb });
  }

  // machine learning sorting with initially random weights
  learnToSort(weights) {
    const length = weights.length;
    let rgb = _.cloneDeep(this.state.rgb);
    rgb = rgb.sort( (a, b) => {
      return (
        weights[_.random(0, length -1)] * a.b - weights[_.random(0, length - 1)] * b.b
      );
    });
    // this.setState({ rgb });
    return rgb;
  }

  train(weights) {
    const guessArray = this.learnToSort(this.state.weights);
    const desiredArray = this.sortColors();
    const errors = desiredArray.map( (correct, index) => {
      return Math.abs(correct.b - guessArray[index].b);
    })
    const avgError = errors.reduce((acc, cur) => acc + cur) / errors.length;
    console.log(errors);
    console.log('ERROR SCORE', avgError);
  }

  // creates desired result
  sortColors() {
    let rgb = _.cloneDeep(this.state.rgb);
    rgb = rgb.sort( (a, b) => {
      return a.b - b.b;
    });
    // this.setState({ rgb });
    return rgb;
  }

  render() {
    return (
      <div>
        <div className="grid">
          {_.map(this.state.rgb, (rgb, i) => (
            <div key={i} className='box' style={{backgroundColor:`rgb(${255},${0},${rgb.b})`}} />
          ))}
        </div>
        <button onClick={() => this.sortColors()}>
          SORT COLORS
        </button>
        <button onClick={() => this.learnToSort(this.state.weights)}>
          LEARN SORT
        </button>
        <button onClick={() => this.createColors()}>
          NEW COLORS
        </button>
        <button onClick={() => this.train()}>
          TRAIN
        </button>
      </div>
    );
  }
}

export default App;
