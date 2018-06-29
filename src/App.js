import React, { Component } from 'react';
import './App.css';
import _ from 'lodash';
// import { range } from 'rambda';

class App extends Component {

  constructor(props) {
    super(props);
    
    this.state = {
      rgb: [],
      weights: [ 1, .25 ], // want these to all eventually become the same thing
      sign: '+'
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
    this.setState({ rgb, weights: [1, .25] });
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

  // create better weights (naive way for now)
  train(weights) {

    let mathFunctions = {
      '+': (a,b) => a + b,
      '-': (a,b) => a - b
    }

    let unadjusted = 0;
    let adjusted = 0;

    const trials = 150;

    for( let i = 0; i < trials; i++){
      let guessArray = this.learnToSort(weights);
      let desiredArray = this.sortColors();
      const unadjustedError = this.calcError(guessArray, desiredArray);
  
      unadjusted += unadjustedError;
  
      let newWeights = _.cloneDeep(weights);
      newWeights[0] = mathFunctions[this.state.sign](newWeights[0], .25)

      guessArray = this.learnToSort(newWeights);
      desiredArray = this.sortColors();
      const adjustedError = this.calcError(guessArray, desiredArray);
  
      adjusted += adjustedError;
    }

    unadjusted /= trials;
    adjusted /= trials;

    const isCorrectAdjustment = adjusted < unadjusted;
    const isFinal = Math.abs(adjusted - unadjusted) < 1;

    console.log(isCorrectAdjustment);

    if(!isCorrectAdjustment && !isFinal) {
      if(this.state.sign === '+') {
        this.setState({ sign: '-'}, () => console.log(this.state.sign))
      } else {
        this.setState({ sign: '+' }, () => console.log(this.state.sign))
      }
    }

    // finalize the weight change
    if( isCorrectAdjustment ) {

      let newWeights = _.cloneDeep(weights);
      newWeights[0] = mathFunctions[this.state.sign](newWeights[0], .25)

      this.setState({ weights: newWeights }, () => {
        console.log(this.state)
      });
    }
    // weight will move either up or down by .25

  }

  calcError(guess, desired) {
    const errors = desired.map( (correct, index) => {
      return Math.abs(correct.b - guess[index].b);
    })
    const avgError = errors.reduce((acc, cur) => acc + cur) / errors.length;
    return avgError;
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
        <button onClick={() => this.setState({ rgb: this.sortColors() })}>
          SORT COLORS
        </button>
        <button onClick={() => this.setState({ rgb:this.learnToSort(this.state.weights) })}>
          LEARN SORT
        </button>
        <button onClick={() => this.createColors()}>
          NEW COLORS
        </button>
        <button onClick={() => this.train(this.state.weights)}>
          TRAIN
        </button>
      </div>
    );
  }
}

export default App;
