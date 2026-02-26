import { DisplayMode, Engine } from "excalibur";
import { loader } from "./resources";
import { TestScene } from "./scenes/test-scene";
import { TableScene } from "./scenes/table-scene";
import { MenuScene } from "./scenes/menu-scene";
import Alpine from "alpinejs";
import { GameData } from "./data/game-data";
import { GaemOver } from "./scenes/game-over";
import { GameOverAnimating } from "./scenes/game-over-animating";

declare global {
  interface Window {
    Alpine: typeof Alpine;
    GameData: typeof GameData;
  }
}

window.Alpine = Alpine
window.GameData = GameData

const game = new Engine({
  width: 1280, // Logical width and height in game pixels
  height: 960,
  displayMode: DisplayMode.FillScreen, // Display mode tells excalibur how to fill the window
  pixelArt: true, // pixelArt will turn on the correct settings to render pixel art without jaggies or shimmering artifacts
  scenes: {
    menu: MenuScene,
    table: TableScene,
    test: TestScene,
    gameOver: GaemOver,
    gameOverAnimating: GameOverAnimating,
  },
  canvasElementId: 'game-canvas',
  // physics: {
  //   solver: SolverStrategy.Realistic,
  //   substep: 5 // Sub step the physics simulation for more robust simulations
  // },
  // fixedUpdateTimestep: 16 // Turn on fixed update timestep when consistent physic simulation is important
});

game.start('menu', { // name of the start scene 'start'
  loader, // Optional loader (but needed for loading images/sounds)
}).then(() => {
  // Do something after the game starts
});

Alpine.start()