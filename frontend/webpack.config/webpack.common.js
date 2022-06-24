import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// eslint-disable-next-line no-underscore-dangle
const __dirname = dirname(fileURLToPath(import.meta.url));
const baseDir = dirname(__dirname);
const legacyDir = join(baseDir, 'src/components/legacy');

export default {
  context: baseDir,
  entry: {
    'sw.js': join(legacyDir, 'app/sw.ts'),
    'launchApp.js': join(legacyDir, 'app/app.ts'),
    'clubsList.js': join(legacyDir, 'club/clubsList.tsx'),
    'eventsGroupListUpdate.js': join(
      legacyDir,
      'group/eventsGroupListUpdate.tsx'
    ),
    'postsGroupListUpdate.js': join(
      legacyDir,
      'group/postsGroupListUpdate.tsx'
    ),
    'groupMembers.js': join(legacyDir, 'group/groupMembers.tsx'),
    'editGroupMembers.js': join(legacyDir, 'group/editGroupMembers.tsx'),
    'eventsView.js': join(legacyDir, 'event/eventsView.tsx'),
    'cowlocathlonCard.js': join(legacyDir, 'roommates/cowlocathlonCard.tsx'),
    'housingMap.js': join(legacyDir, 'roommates/housingMap.tsx'),
    'createHousing.js': join(legacyDir, 'roommates/createHousing.tsx'),
    'subscribeButton.js': join(legacyDir, 'notification/subscribeButton.tsx'),
    'deviceSubscribeButton.js': join(
      legacyDir,
      'notification/deviceSubscribeButton.tsx'
    ),
    'reactApp.js': join(baseDir, 'src/index.tsx'),
  },
  output: {
    path: join(baseDir, '../backend/static/js'),
    filename: '[name]',
  },
  module: {
    rules: [
      {
        test: [/\.jsx?$/, /\.tsx?$/],
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader', // 3. Inject styles into DOM
          'css-loader', // 2. Turns css into commonjs
          'sass-loader', // 1. Turns sass into css
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.js', '.json', '.ts', '.jsx'],
  },
};
