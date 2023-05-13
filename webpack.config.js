const path = require('path');

const commonConfig = {
    mode: "production",
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          exclude: /node_modules/
        },{
          test: /\.jsx?$/,
          loader: 'babel-loader',
          exclude: [/node_modules/]
        }
      ]
    },
    resolve: {
      extensions: [ '.tsx', '.ts', '.js', 'jsx' ]
    },
    devtool: 'source-map'
};

const app = {
    ...commonConfig,
    entry: {
        'app':'./src/app.ts'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'build')
    }
}


module.exports=[app];
