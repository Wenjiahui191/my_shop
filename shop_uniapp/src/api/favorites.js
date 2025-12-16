import { get, post, del } from '../utils/request';

export function listFavorites(params) {
  return get('/favorites', params);
}

export function addFavorite(productId) {
  return post('/favorites', { product_id: productId });
}

export function removeFavorite(productId) {
  return del(`/favorites/${productId}`);
}

export function checkFavorite(productId) {
  return get('/favorites/check', { product_id: productId });
}


