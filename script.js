var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

// Circle properties
var circleX = 50;
var circleY = 100;
var circleRadius = 30;
var circleGap = 40;

// Arrow properties
var arrowLength = 50;
var arrowHeight = 10;
var arrowGap = 30;

// Colors for circles
var colors = ["#ff5733", "#33ff57", "#5733ff", "#ffff33"];

// arrow positions
var arrowPositions = [];

// circle colors
var circleColors = colors.slice();

// Currently active arrow index
var activeArrowIndex = -1;

// Flag to indicate if the arrow has hit the ball
var arrowHit = false;

// Function to draw circles
function drawCircles() {
  for (var i = 0; i < colors.length; i++) {
    ctx.beginPath();
    ctx.arc(
      circleX,
      circleY + i * (circleRadius * 2 + circleGap),
      circleRadius,
      0,
      Math.PI * 2
    );
    ctx.strokeStyle = "#000"; // Set the circle border color
    ctx.stroke(); // Draw the circle border
    ctx.fillStyle = circleColors[i];
    ctx.fill();
    ctx.closePath();
  }
}

// Function to draw arrows
function drawArrows() {
  for (var i = 0; i < colors.length; i++) {
    var startX = canvas.width - arrowGap;
    var startY = circleY + i * (circleRadius * 2 + circleGap);
    var endX = startX - arrowLength;
    arrowPositions.push({ x: endX, y: startY });
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, startY);
    ctx.lineTo(endX + arrowHeight, startY - arrowHeight / 2);
    ctx.moveTo(endX, startY);
    ctx.lineTo(endX + arrowHeight, startY + arrowHeight / 2);
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.closePath();
  }
}

// Function to update arrow position and check for collision
function updateArrows() {
  var arrow = arrowPositions[activeArrowIndex];
  ctx.clearRect(
    0,
    arrow.y - arrowHeight,
    arrow.x + arrowLength + arrowHeight,
    arrowHeight * 2
  );
  if (!arrowHit) {
    arrow.x -= 5; // Move arrow towards the circle
    ctx.beginPath();
    ctx.moveTo(arrow.x, arrow.y);
    ctx.lineTo(arrow.x - arrowLength, arrow.y);
    ctx.lineTo(arrow.x - arrowLength + arrowHeight, arrow.y - arrowHeight / 2);
    ctx.moveTo(arrow.x - arrowLength, arrow.y);
    ctx.lineTo(arrow.x - arrowLength + arrowHeight, arrow.y + arrowHeight / 2);
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();

    // Check for collision with circle
    var bubbleRightEdgeX = circleX + 3 * circleRadius - 4; // Calculate the right edge of the bubble
    if (
      arrow.x <= bubbleRightEdgeX &&
      arrow.x >= bubbleRightEdgeX - arrowLength
    ) {
      // Adjust condition to stop before hitting the bubble
      circleColors[activeArrowIndex] =
        "#" + Math.floor(Math.random() * 16777215).toString(16); // Change circle color
      arrowHit = true; // Set arrow hit flag
      clearInterval(interval); // Stop moving arrow
      ctx.clearRect(
        circleX - circleRadius - 1,
        circleY +
          activeArrowIndex * (circleRadius * 2 + circleGap) -
          circleRadius -
          1,
        circleRadius * 2 + 2,
        circleRadius * 2 + 2
      );
      ctx.beginPath();
      ctx.arc(
        circleX,
        circleY + activeArrowIndex * (circleRadius * 2 + circleGap),
        circleRadius,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = circleColors[activeArrowIndex];
      ctx.fill();
      ctx.strokeStyle = "#000"; // Set the circle border color
      ctx.stroke(); // Draw the circle border
      ctx.closePath();
      activeArrowIndex = -1; // Reset active arrow index
    }
  }
}

// Event listener for mouse clicks
// Event listener for mouse clicks
canvas.addEventListener("click", function (event) {
  var x = event.clientX - canvas.getBoundingClientRect().left;
  var y = event.clientY - canvas.getBoundingClientRect().top;

  // Check if the click hits any circle and if arrow is not already active and if the ball is not already hit

  for (var i = 0; i < colors.length; i++) {
    if (
      x >= circleX - circleRadius &&
      x <= circleX + circleRadius &&
      y >= circleY + i * (circleRadius * 2 + circleGap) - circleRadius &&
      y <= circleY + i * (circleRadius * 2 + circleGap) + circleRadius
    ) {
      // Start moving the corresponding arrow
      activeArrowIndex = i;
      interval = setInterval(function () {
        updateArrows();
      }, 50);
      arrowHit = false;
      // Exit the loop once a circle is hit
    }
  }
});

// Function to reset the application
function reset() {
  clearInterval(interval);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  arrowPositions = [];
  circleColors = colors.slice();
  activeArrowIndex = -1;
  arrowHit = false;
  drawCircles();
  drawArrows();
}

// Initial drawing
drawCircles();
drawArrows();
