import levelMeter from './levelMeter'

const empty = 'http://i.imgur.com/XghKoNm.png';
const full = 'http://i.imgur.com/GML0sb0.png';

const WaterLevelMeter = levelMeter(empty, full);
WaterLevelMeter.displayName = WaterLevelMeter;

export default WaterLevelMeter;
