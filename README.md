# reversi-react

[![build status](https://travis-ci.org/shuntksh/reversi-react.svg?branch=master)](https://travis-ci.org/shuntksh/reversi-react)

<p align="center">
  <img alt="Square" width="480px" src="https://github.com/shuntksh/reversi-react/blob/master/doc/board-demo.gif">
</p>

An attempt to create an example React application something other than Todo app. In this project, we are going to implement [the Reversi game](https://en.wikipedia.org/wiki/Reversi) using [React.js](https://facebook.github.io/react/) with [TypeScript](http://www.typescriptlang.org/). To demonstrate virtual DOM rendering in action, the app only uses nomrmal DOM elements such that `HTMLDivElement` and `HTMLSpanElement` to with CSS3 animations.

-   Support both PC clients and mobile clients
-   Use typescript, react, react-dom, mobx to build a game
-   Use css3 for basic animation effect (no Canvas / WebGL / SVG)
-   Use html5 Audio for sound effects

## Design

<p align="center">
  <img alt="Diagram" width="50%" src="https://github.com/shuntksh/reversi-react/blob/master/doc/component-diagram.png">
</p>

### `<Square />`

Square is a component represents each square of the board. Its responsibility is to render a piece based on value passed as props. It automatically injects respective CSS animations for visual effects and plays HTML5 audio for sound effects.

<p align="left">
  <img alt="Square" width="150px" src="https://github.com/shuntksh/reversi-react/blob/master/doc/square-demo.gif">
</p>

```tsx
<div style={{ display: "block", paddingLeft: "40px" }}>
    <Square value={this.state.value} dot={0}/>
</div>
<div style={{ margin: "10px", display: "inline-block" }}>
    <button onClick={this.reset}>Reset</button>
    <button onClick={this.toBlack}>Black</button>
    <button onClick={this.toWhite}>White</button>
</div>
```

### `<Board />`

Board is a component represents Reversi game and provides user interaction by invoking a right callback for mouse and touch events. However, it has zero knowledge on how the Reversi game should be played. It only renders the game based on two dimentional array that describes board passed by game logic (or shared state provided by MobX in this case).

```tsx
<Board values={this.state.value} onClickSquare={this.handleClick} />
```

## How to build

```bash
# Using yarn
yarn
yarn start

# Or using npm
npm install
npm run start
```

## History
