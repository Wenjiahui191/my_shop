import { get } from '../utils/request';

export function fetchCategories() {
  return get('/products/categories');
}

export function fetchProducts(params) {
  return get('/products', params);
}

export function fetchProductDetail(id) {
  return get(`/products/${id}`);
}


