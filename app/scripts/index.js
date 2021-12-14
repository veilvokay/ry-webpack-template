
import Post from "./Post";
import data from '../mocks/data';
import '../styles/index.css';

const post = new Post('Webpack post');

console.log('post ot string', post.toString());

console.log('JSON: ', data);