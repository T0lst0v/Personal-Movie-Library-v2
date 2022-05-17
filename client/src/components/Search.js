import React from "react";
import "./search.css";

class Search extends React.Component {
  constructor() {
    super();

    this.state = {
      title: "",
    };
  }
  handleSearch = (ev) => {
    this.setState({ title: ev.target.value });
  };

  displayResults = () => {
    console.log();
    console.log(this.props.books);
  };

  render() {
    return (
      <div id="search">
        <input type="text" placeholder="Book Title" onChange={this.handleSearch}></input>

        <button onClick={this.displayResults}> find </button>
      </div>
    );
  }
}

export default Search;
