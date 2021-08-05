var path = require('path');
module.exports = {
  entry:  {
    studentCourseSelector: path.join(__dirname, '../src/containers/studentCourseSelector.tsx'),
    eventsGroupListUpdate: path.join(__dirname, '../src/containers/eventsGroupListUpdate.tsx'),
    postsGroupListUpdate: path.join(__dirname, '../src/containers/postsGroupListUpdate.tsx'),
    housingMap: path.join(__dirname, '../src/containers/housingMap.tsx'),
    createHousing: path.join(__dirname, '../src/containers/createHousing.tsx'),
    //editHousing: path.join(__dirname, '../src/containers/editHousing.tsx')
  },
  output: {
    path: path.join(__dirname, '../../server/static/js'),
    filename: '[name].js'
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
        use: ["style-loader", "css-loader"],
      },
    ],
  }
}