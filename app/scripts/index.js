
import Post from "./Post";
import data from '../mocks/data';
import WebpackLogo from '../assets/webpack-logo.png'
import '../styles/index.css';

const post = new Post('Webpack post', WebpackLogo);

console.log('post ot string', post.toString());

console.log('JSON: ', data);