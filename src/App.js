import React, { Component } from 'react';
import './App.css';

const isOperator = /[x/+-]/,
      endsWithOperator = /[x/+-]$/,
      equalsStyle = {
        position: 'absolute',
        height: 130,
        bottom: 0
      };

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentVal: '0',
      prevVal: '0',
      formula: '',
      currentSign: 'pos',
      lastClicked: ''
    }
  }

  maxDigitWarning = () => {
    this.setState({
      currentVal: 'Digit Limit Met',
      prevVal: this.state.currentVal
    });
    setTimeout( () => this.setState({
      currentVal: this.state.prevVal
    }), 1000);
  }

  handleEvaluate = () => {
    if (!this.state.currentVal.includes('Limit')) {
      let expression = this.state.formula;
      if (endsWithOperator.test(expression)) 
      expression = expression.slice(0, -1);
      expression = expression.replace(/x/g, "*").replace(/‑/g, "-");
      let answer = Math.round(1000000000000 * eval(expression)) / 1000000000000;
      this.setState({
        currentVal: answer.toString(),
        formula: expression.replace(/\*/g, '⋅').replace(/-/g, '‑') + '=' + answer,
        prevVal: answer,
        evaluated: true
      });
      
    }
  }

  handleOperators = (e) => { 
    if (!this.state.currentVal.includes('Limit')) {
      this.setState({
        currentVal: e.target.value, 
        evaluated: false
      });
      if (this.state.formula.includes('=')) {
        this.setState({
          formula: this.state.prevVal + e.target.value
        });
      } else {
        this.setState({
          prevVal: !isOperator.test(this.state.currentVal) ? 
            this.state.formula : 
            this.state.prevVal,
          formula: !isOperator.test(this.state.currentVal) ? 
            this.state.formula += e.target.value : 
            this.state.prevVal += e.target.value
        });
      }
    }
  }

  handleNumbers = (e) => {
    if (!this.state.currentVal.includes('Limit')) {
      this.setState({
        evaluated: false
      })
      if (this.state.currentVal.length > 15) {
        this.maxDigitWarning();
      } else if (this.state.evaluated === true) {
        this.setState({
          currentVal: e.target.value,
          formula: e.target.value !== '0' ? e.target.value : '',
        });
      } else {
        this.setState({
          currentVal: 
            this.state.currentVal === '0' || 
            isOperator.test(this.state.currentVal) ? 
            e.target.value : this.state.currentVal + e.target.value,
          formula:  
            this.state.currentVal === '0' && e.target.value === '0' ?
            this.state.formula : 
            /([^.0-9]0)$/.test(this.state.formula) ? 
            this.state.formula.slice(0, -1) + e.target.value :
            this.state.formula + e.target.value,
        });
      }
    }
  }

  handleDecimal = () => {
    if (this.state.evaluated === true) {
      this.setState({
        currentVal: '0.',
        formula: '0.',
        evaluated: false});
    } else if (!this.state.currentVal.includes('.') &&
      !this.state.currentVal.includes('Limit')) {
      this.setState({evaluated: false})
      if (this.state.currentVal.length > 15) {
        this.maxDigitWarning();
      } else if (endsWithOperator.test(this.state.formula) || 
        (this.state.currentVal === '0' && this.state.formula === '')) {
        this.setState({
          currentVal: '0.',
          formula: this.state.formula + '0.'
        });         
      } else {
        this.setState({
          currentVal: this.state.formula.match(/(-?\d+\.?\d*)$/)[0] + '.',
          formula: this.state.formula + '.',
        });
      }
    }
  }
  
  clearButton = () => {
    this.setState({
      currentVal: '0',
      prevVal: '0',
      formula: '',
      currentSign: 'pos',
      lastClicked: ''
    });
  }

  render() {
    return (
      <div>
        <div className='calculator'>
          <Formula 
            formula = {this.state.formula.replace(/x/g, '⋅')} 
          />
          <Output
            currentValue = {this.state.currentVal} 
          />
          <Buttons 
            evaluate={this.handleEvaluate}
            operators={this.handleOperators}
            clearButton={this.clearButton}
            numbers={this.handleNumbers}
            decimal={this.handleDecimal} 
          />
        </div>
      </div>
    )
  }
};

class Buttons extends Component {
  render() {
    return (
      <div>
        <button id="clear" value='AC' onClick={this.props.clearButton} className='large-btn'>AC</button>
        <button id="divide" value='/' onClick={this.props.operators}>/</button>
        <button id="multiply" value='x' onClick={this.props.operators}>x</button>
        <button id="seven" value='7' onClick={this.props.numbers}>7</button>
        <button id="eight" value='8' onClick={this.props.numbers}>8</button>
        <button id="nine" value='9' onClick={this.props.numbers}>9</button>
        <button id="subtract" value='-' onClick={this.props.operators}>-</button>
        <button id="four" value='4' onClick={this.props.numbers}>4</button>
        <button id="five" value='5' onClick={this.props.numbers}>5</button>
        <button id="six" value='6' onClick={this.props.numbers}>6</button>
        <button id="add" value='+' onClick={this.props.operators}>+</button>
        <button id="one" value='1' onClick={this.props.numbers}>1</button>
        <button id="two" value='2' onClick={this.props.numbers}>2</button>
        <button id="three" value='3' onClick={this.props.numbers}>3</button>
        <button id="zero" value='0' onClick={this.props.numbers} className='large-btn'>0</button>
        <button id="decimal" value='.' onClick={this.props.decimal}>.</button>
        <button id="equals" value='=' onClick={this.props.evaluate} style={equalsStyle}>=</button>
      </div>
    );
  }
}

class Formula extends Component {
  render() {
    return (
      <div className="formulaScreen">
        {this.props.formula}
      </div>
    );
  }
}

class Output extends Component {
  render() {
    return (
      <div id="display" className="outputScreen">
        {this.props.currentValue}
      </div>
    );
  }
}

export default App;