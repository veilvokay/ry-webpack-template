import Post from './models/Post';
// import data from '../mocks/data';
// import xml from '../mocks/data.xml';
import WebpackLogo from '../assets/webpack-logo.png';
import 'styles/index.css';

const post = new Post('Webpack post', WebpackLogo);

console.log('post ot string', post.toString());

// console.log('JSON: ', data);
// console.log('XML: ', xml);