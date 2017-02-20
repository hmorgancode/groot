// Test data. A few legit entries with additional lorem ipsum.
// TODO: figure out whether you like using upper snake case to differentiate consts from const refs

const randomValidIndex = (length) => Math.min((Math.random() * length).toFixed(), length - 1);

const LOREM_IPSUM = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
const LOREM_IPSUM_WORDS = LOREM_IPSUM.split(' ');
function randomWord() {
  let word = LOREM_IPSUM_WORDS[randomValidIndex(LOREM_IPSUM_WORDS.length)];
  return word.charAt(0).toUpperCase() + word.slice(1);
}

const genericTestThumbnails = [];
for (let i = 1; i < 4; ++i) {
  genericTestThumbnails.push(`${process.env.PUBLIC_URL}/testimg/test${i}.jpg`);
}

const GENERIC_TAGS = ['Carnivorous', 'Humidity-Sensitive', 'Succulent', 'Annual', 'Invasive'];
function getRandomTags() {
  let randomTags = [];
  const MAX_TAGS = 2;
  for (let i = 0; i < MAX_TAGS; ++i) {
    if (Math.random() < .33) {
      break;
    }
    const newTag = GENERIC_TAGS[randomValidIndex(GENERIC_TAGS.length)];
    if (!randomTags.find((tag) => tag === newTag)) {
      randomTags.push(newTag);
    }
  }
  return randomTags;
}

const TEST_PLANT_COUNT = 20;

export const plants = [
  {
    id: 0,
    name: 'Drosera Venusta',
    altName: 'Elegant Sundew',
    thumbnail: 'http://cdn3.volusion.com/x9tky.hjnm9/v/vspfiles/photos/DRO-VEN-2T.jpg',
    tags: ['Carnivorous'],
    instructions: 'Fill its tray up to 1cm. Then chuck a plant treat at it!',
    vitality: 'Average',
    waterLevel: 0, // in cm
    waterTarget: 1 // in cm or ratio, depending on water measurement type
  },
  {
    id: 1,
    name: 'Nepenthes Campanulata',
    altName: 'Bell-Shaped Pitcher Plant',
    thumbnail: 'http://cdn3.volusion.com/x9tky.hjnm9/v/vspfiles/photos/NEP-CAM-2T.jpg',
    tags: ['Carnivorous', 'Humidity-Sensitive'],
    instructions: `Keep soil damp, but do not leave it sitting in water. Mist lightly if possible, and refill humidifier in winter- this lil' guy is humidity-sensitive.`,
    vitality: 'Sensitive',
    notes: `Probably lacks pitchers. (This one's going to a nice humid terrarium once it's settled.)`,
    soilMoisture: 0.4, // 0 is bone-dry, 1 is soaking wet,
    waterTarget: 0.7
  },
  {
    id: 2,
    name: 'Spider Plant',
    altName: 'Spider Plant',
    thumbnail: 'https://maxpull-gdvuch3veo.netdna-ssl.com/wp-content/uploads/2016/05/spider-plant-fertilizer.jpg',
    tags: [],
    instructions: 'Water it a bit? (This thing is really hard to kill, so do whatever.)',
    vitality: 'Vigorous',
    soilMoisture: 0.1,
    waterTarget: 0.5
  }
];
for (let i = 3; i < TEST_PLANT_COUNT; ++i) {
  const waterType = Math.random() > 0.75 ? 'waterLevel' : 'soilMoisture';
  plants.push({
    id: i,
    name: `${randomWord()} ${randomWord()}`,
    altName: `${randomWord()} ${randomWord()}`,
    thumbnail: genericTestThumbnails[(Math.random() * 30).toFixed() % 3],
    tags: getRandomTags(),
    instructions: LOREM_IPSUM,
    vitality: ['Sensitive', 'Average', 'Vigorous'][i % 3],
    [waterType]: Math.random().toFixed(1) * .5, // halve to show fewer test plants as overwatered
    waterTarget: Math.random().toFixed(1)
  });
}

// Note: 'plants' is an array of indices into 'plants'.
export const rooms = [
  {
    name: 'Hallway',
    plants: [0, 1]
  },
  {
    name: 'Kitchen',
    plants: [2]
  },
  {
    name: 'Living Room',
    plants: []
  }
];
for (let i = 3; i < TEST_PLANT_COUNT; ++i) {
  rooms[i % 3].plants.push(i);
}
