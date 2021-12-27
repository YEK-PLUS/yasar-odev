import React from "react";
import "./App.css";
import Game from "./components/game";
import DrawMap from "./components/draw-map";

class App extends React.Component {
  state = {
    speed: 3,
    mode: "game",
  };
  constructor(props) {
    super(props);
    global.speed = 3;
  }
  onGameClick = () => {
    this.setState({ mode: "game" });
  };

  onDrawMapClick = () => {
    this.setState({ mode: "draw" });
  };
  slow = () => {
    global.speed = Math.round((global.speed - 0.1) * 100) / 100
    this.setState({ speed: global.speed });
  };
  fast = () => {
    global.speed = Math.round((global.speed + 0.1) * 100) / 100
    this.setState({ speed: global.speed });
  };

  render() {
    return (
      <div style={{ width: "100%", height: "100%" }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div
            onClick={this.onGameClick}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "auto",
              height: "40px",
              color: "white",
              backgroundColor: "#0698D1",
              margin: "0 0 0 20px",
              padding: "0 20px",
              cursor: "pointer",
            }}
          >
            Game
          </div>
          <div
            onClick={this.onDrawMapClick}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "auto",
              height: "40px",
              color: "white",
              backgroundColor: "#0698D1",
              margin: "0 0 0 20px",
              padding: "0 20px",
              cursor: "pointer",
            }}
          >
            Draw Map
          </div>
          <div
            onClick={this.slow}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "auto",
              height: "40px",
              color: "white",
              backgroundColor: "#0698D1",
              margin: "0 0 0 20px",
              padding: "0 20px",
              cursor: "pointer",
            }}
          >
            Slow
          </div>
          <div
            onClick={this.fast}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "auto",
              height: "40px",
              color: "white",
              backgroundColor: "#0698D1",
              margin: "0 0 0 20px",
              padding: "0 20px",
              cursor: "pointer",
            }}
          >
            Fast
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "auto",
              height: "40px",
              color: "white",
              backgroundColor: "#0698D1",
              margin: "0 0 0 20px",
              padding: "0 20px",
              cursor: "pointer",
            }}
          >
            Speed {this.state.speed}
          </div>
        </div>
        {this.state.mode === "game" ? <Game /> : <DrawMap />}
      </div>
    );
  }
}

export default App;
