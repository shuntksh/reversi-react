# reversi-react

[![Greenkeeper badge](https://badges.greenkeeper.io/shuntksh/reversi-react.svg)](https://greenkeeper.io/)
[![build status](https://travis-ci.org/shuntksh/reversi-react.svg?branch=master)](https://travis-ci.org/shuntksh/reversi-react)

An attempt to create an example React application something other than Todo app. In this project, we are going to implement [the Reversi game](https://en.wikipedia.org/wiki/Reversi) using [React.js](https://facebook.github.io/react/), [MobX](https://mobx.js.org/) and [TypeScript](http://www.typescriptlang.org/). To demonstrate virtual DOM rendering in action, the app only uses nomrmal DOM elements such that `HTMLDivElement` and `HTMLSpanElement` to with CSS3 animations.

- Support both PC clients and mobile clients
- Use typescript, react, react-dom, mobx to build a game
- Use css3 for basic animation effect (no Canvas / WebGL / SVG)
- Use html5 Audio for sound effects

## Design

<p align="center">
  <img alt="Diagram" width="75%" src="https://github.com/shuntksh/reversi-react/blob/master/doc/component-diagram.png">
</p>

### `<Board />`

TBA

### `<Square />`

Square is the component represents each square of the board. Its responsibility is to render a piece based on value passed as props. It automatically injects respective CSS animations for visual effects and plays HTML5 audio for sound effects.

<p align="left">
  <img alt="Square" width="150px" src="https://github.com/shuntksh/reversi-react/blob/master/doc/square-demo.gif">
</p>

```tsx
<div style={{ margin: "100px" }}>
    <div style={{ display: "block", paddingLeft: "40px" }}>
        <Square value={this.state.value} dot={0}/>
    </div>
    <div style={{ margin: "10px", display: "inline-block" }}>
        <button onClick={this.reset}>Reset</button>
        <button onClick={this.toBlack}>Black</button>
        <button onClick={this.toWhite}>White</button>
    </div>
</div>
```

#### Board

TBA

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
