// DOM Elements
const videoElement = document.getElementById('input_video');
const canvasElement = document.getElementById('output_canvas');
const canvasCtx = canvasElement.getContext('2d');

// Load default shirt
const shirtImage = new Image();
shirtImage.src = 'images/tshirt1.png';

// Function to switch shirt image
function setShirt(src) {
  shirtImage.src = src;

  // Highlight selected shirt
  document.querySelectorAll('#shirtGallery img').forEach(img => {
    img.classList.remove('border-white');
  });

  const selected = document.querySelector(`#shirtGallery img[src="${src}"]`);
  if (selected) selected.classList.add('border-white');
}

// MediaPipe Pose setup
const pose = new Pose({
  locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
});

pose.setOptions({
  modelComplexity: 1,
  smoothLandmarks: true,
  enableSegmentation: false,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});

pose.onResults(onResults);

// Main drawing function
function onResults(results) {
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

  if (results.poseLandmarks) {
    const lm = results.poseLandmarks;

    const leftShoulder = lm[11];
    const rightShoulder = lm[12];
    const leftHip = lm[23];
    const rightHip = lm[24];

    const shirtWidth = Math.abs(rightShoulder.x - leftShoulder.x) * canvasElement.width * 1.6;

    const upperY = (leftShoulder.y + rightShoulder.y) / 2;
    const lowerY = (leftHip.y + rightHip.y) / 2;
    const shirtHeight = (lowerY - upperY) * canvasElement.height * 1.3;

    const centerX = (leftShoulder.x + rightShoulder.x) / 2 * canvasElement.width;
    const shirtX = centerX - shirtWidth / 2;
    const shirtY = upperY * canvasElement.height - shirtHeight * 0.15;

    canvasCtx.drawImage(shirtImage, shirtX, shirtY, shirtWidth, shirtHeight);
  }

  canvasCtx.restore();
}

// Start camera and pose tracking
const camera = new Camera(videoElement, {
  onFrame: async () => {
    await pose.send({ image: videoElement });
  },
  width: 640,
  height: 480
});
camera.start();

// ==== Preview Shirt Gallery (Static List) ====
const shirtImages = [
  'tshirt1.png',
  'tshirt2.png',
  'tshirt3.png',
  'tshirt4.png'
];

const gallery = document.getElementById('shirtGallery');

shirtImages.forEach(name => {
  const thumb = document.createElement('img');
  thumb.src = `images/${name}`;
  thumb.className = 'w-20 h-20 object-contain cursor-pointer border-2 border-transparent hover:border-white rounded transition duration-200';
  thumb.title = name;

  thumb.onclick = () => setShirt(`images/${name}`);
  gallery.appendChild(thumb);
});
