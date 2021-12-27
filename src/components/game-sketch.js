import { Network, Layer } from "synaptic";

class NNetwork {
  learningRate = 0.3;

  constructor() {
    var inputLayer = new Layer(2);
    var hiddenLayer1 = new Layer(10);
    var outputLayer = new Layer(2);
    inputLayer.project(hiddenLayer1);
    hiddenLayer1.project(outputLayer);
    this.nn = new Network({
      input: inputLayer,
      hidden: [hiddenLayer1],
      output: outputLayer,
    });
  }
}

const WIDTH = 640;
const HEIGHT = 480;

const getRadian = (angle) => (angle * Math.PI) / 180;

class DistanceSensor {
  maxDistance = 100;
  foundX = 0;
  foundY = 0;

  findIntersection = (
    counter,
    worldPixels,
    carX,
    carY,
    targetX,
    targetY,
    carAngle
  ) => {
    if (counter > this.maxDistance) {
      return false;
    }
    const pixel = worldPixels[Math.floor(carY) * WIDTH + Math.floor(carX)];
    if (pixel && pixel[0] !== 0) {
      return this.findIntersection(
        counter + 1,
        worldPixels,
        carX + 1 * Math.cos(getRadian(carAngle)),
        carY + 1 * Math.sin(getRadian(carAngle)),
        targetX,
        targetY,
        carAngle
      );
    }
    return [carX, carY];
  };

  getValue = (worldPixels, carX, carY, carAngle) => {
    const targetX =
      carX + this.maxDistance * Math.cos(getRadian(carAngle)) + 20;
    const targetY =
      carY + this.maxDistance * Math.sin(getRadian(carAngle)) + 12.5;
    if (worldPixels) {
      const result = this.findIntersection(
        0,
        worldPixels,
        carX,
        carY,
        targetX,
        targetY,
        carAngle
      );
      const [foundX, foundY] = result ? result : [targetX, targetY];
      this.foundX = foundX;
      this.foundY = foundY;
      return Math.min(
        1,
        Math.sqrt(Math.pow(carX - foundX, 2) + Math.pow(carY - foundY, 2)) /
          this.maxDistance
      );
    }
    return 0;
  };
}

let carCounter = 0;

class Car {
  constructor() {
    this.reset();
    this.id = carCounter++;
  }

  reset() {
    this.start = Date.now();
    this.x = 120;
    this.y = 140;
    this.width = 40;
    this.height = 25;
    this.angle = 0;
    this.sensors = [new DistanceSensor()];

    this.speed = global.speed;
    this.maxSpeed = global.speed + 10;
    this.acc = 0.5;
  }

  speedUp = () => {};

  speedDown = () => {};

  steerLeft = () => {
    for (var i = 40; i > 0; i--) {
      this.angle = (this.angle - 0.1) % 360;
    }
  };

  steerRight = () => {
    for (var i = 40; i > 0; i--) {
      this.angle = (this.angle + 0.1) % 360;
    }
  };

  update = (myNetwork, worldPixels) => {
    this.x += this.speed * Math.cos(getRadian(this.angle));
    this.y += this.speed * Math.sin(getRadian(this.angle));

    const sensorData = this.collectSensorData(worldPixels);
    if (sensorData[0] === 0) {
      this.reset();
    }

    let [output1, output2] = myNetwork.nn.activate([sensorData, this.angle]);

    const shouldSteerLeft = output1 > output2;
    if (shouldSteerLeft) {
      this.steerLeft();
    } else {
      this.steerRight();
    }

    const newSensorData = this.collectSensorData(worldPixels);
    if (newSensorData[0] === 1) {
      myNetwork.nn.propagate(0.3, [0.5, 0.5]);
    } else if (newSensorData[0] < sensorData[0]) {
      myNetwork.nn.propagate(0.2, shouldSteerLeft ? [0, 1] : [1, 0]);
    }
  };

  collectSensorData = (worldPixels) => {
    return this.sensors.map((sensor) =>
      sensor.getValue(worldPixels, this.x, this.y, this.angle)
    );
  };
}

export default function sketch(p) {
  const cars = [];
  for (var i = 0; i < 100; i++) {
    cars.push(new Car());
  }
  const myNetwork = new NNetwork();
  let worldPixels;
  let canvas;
  let image;

  p.setup = () => {
    canvas = p.createCanvas(WIDTH, HEIGHT);
    p.noStroke();
    p.background(255);

    worldPixels = JSON.parse(window.localStorage["map"]).values;
    const image1 = p.get(0, 0, WIDTH, HEIGHT);
    image1.loadPixels();
    for (var i = 0; i < image1.pixels.length; i += 4) {
      const startIndex = Math.floor(i / 4);
      image1.pixels[i] = worldPixels[startIndex][0];
      image1.pixels[i + 1] = worldPixels[startIndex][1];
      image1.pixels[i + 2] = worldPixels[startIndex][2];
      image1.pixels[i + 3] = 255;
    }
    image1.updatePixels();
    image = image1;
  };

  p.mousePressed = () => {
    console.log(p.get(p.mouseX, p.mouseY));
  };

  p.draw = () => {
    p.update();

    if (true) {
      p.background(255);
      if (image) {
        p.image(image, 0, 0, WIDTH, HEIGHT);
      }
      [cars[0]].map((car) => {
        p.rectMode(p.CENTER);
        p.translate(car.x, car.y);
        p.angleMode(p.DEGREES);
        p.rotate(car.angle);
        p.fill(17, 189, 255);
        p.rect(0, 0, car.width, car.height);
        p.fill(6, 152, 209);
        p.rect(10, 0, 10, 15);
        p.fill("yellow");
        p.rect(20, -8.5, 4, 6);
        p.rect(20, 8.5, 4, 6);
        p.fill("black");
        p.rect(10, car.height / 2, 8, 4);
        p.rect(10, 0 - car.height / 2, 8, 4);
        p.rect(-10, 0 - car.height / 2, 8, 4);
        p.rect(-10, car.height / 2, 8, 4);
        p.stroke("red");
        p.stroke(0);
        return true;
      });
    }
  };

  p.update = () => cars.forEach((car) => car.update(myNetwork, worldPixels));

  p.myCustomRedrawAccordingToNewPropsHandler = (newProps) => {
    if (canvas)
      p.fill(newProps.color);
  };
}
