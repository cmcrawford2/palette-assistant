import React from 'react';
import './style.css'

export default class Recomputed extends React.Component {

  render() {

    if (this.props.computed === false && this.props.weights === false) // Nothing to show.
      return null;
    
    var weightString = "";
    if (this.props.weights === true) {
      weightString = "  " + this.props.rw.toString() + " for red, " +
                            this.props.gw.toString() + " for green, and " +
                            this.props.bw.toString() + " for blue.";
    }
    var printError = false;
    var printWeight = false;
    var errorMessage = "";
    var weightMessage = "";

    if (this.props.sorted === false && this.props.computed === true) {
      // Nothing happened, let the user know.
      errorMessage = "Please sort all colors before recomputing.";
      printError = true;
      if (this.props.weights === true) {
        weightMessage = "Current weights are" + weightString;
        printWeight = true;
      }
    }
    else if (this.props.computed === true) {
      weightMessage = "Recomputed weights are" + weightString;
      printWeight = true;
    }
    else if (this.props.weights === true) {
      weightMessage = "Current weights are" + weightString;
      printWeight = true;
    }

    return (
      <div className="SortDescriptionContainer">
        <div className="SortDescription">
          { printError && <h3>{errorMessage}</h3> }
          { printWeight && <h3>{weightMessage}</h3> }
        </div>
      </div>
    );
  }
}