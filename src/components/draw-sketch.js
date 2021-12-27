const WIDTH = 640;
const HEIGHT = 480;

export default function sketch(p) {
  let canvas;

  p.setup = () => {
    canvas = p.createCanvas(WIDTH, HEIGHT);
    p.noStroke();
    p.background(255);
  };

  p.draw = () => {
    p.fill("black");
    p.noStroke();
    if (p.mouseIsPressed === true) {
      p.ellipse(p.mouseX, p.mouseY, 40, 40);
    }
    if (p.keyCode === 83) {
      p.keyCode = 0;
      const image1 = p.get(0, 0, WIDTH, HEIGHT);
      image1.loadPixels();
      const px = [];
      for (var i = 0; i < image1.pixels.length; i += 4) {
        const R = image1.pixels[i];
        const G = image1.pixels[i + 1];
        const B = image1.pixels[i + 2];
        px.push([R, G, B]);
      }
      window.localStorage["map"] = JSON.stringify({ values: px });
    }
  };

  p.myCustomRedrawAccordingToNewPropsHandler = (newProps) => {
    if (canvas) p.fill(newProps.color);
  };
}
