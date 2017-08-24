import index from '../pages/index.js';
export default [
  {
    name: 'index',
    path: '/index',
    component: index
  },
  {
    path: '/*',
    component: index
  }
];
