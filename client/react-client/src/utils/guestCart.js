// Utilidades para manejar el carrito de invitado (localStorage)

const GUEST_CART_KEY = 'guest_cart';

/**
 * Obtener carrito de invitado desde localStorage
 */
export const getGuestCart = () => {
  try {
    const cartData = localStorage.getItem(GUEST_CART_KEY);
    return cartData ? JSON.parse(cartData) : [];
  } catch (error) {
    console.error('Error al obtener carrito invitado:', error);
    return [];
  }
};

/**
 * Guardar carrito de invitado en localStorage
 */
export const saveGuestCart = (cartItems) => {
  try {
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cartItems));
  } catch (error) {
    console.error('Error al guardar carrito invitado:', error);
  }
};

/**
 * Agregar producto al carrito invitado
 */
export const addToGuestCart = (productoId, cantidad = 1) => {
  const cart = getGuestCart();
  const existingItem = cart.find(item => item.productoId === productoId);

  if (existingItem) {
    existingItem.cantidad += cantidad;
  } else {
    cart.push({ productoId, cantidad });
  }

  saveGuestCart(cart);
  return cart;
};

/**
 * Actualizar cantidad de producto en carrito invitado
 */
export const updateGuestCartItem = (productoId, cantidad) => {
  const cart = getGuestCart();
  const item = cart.find(item => item.productoId === productoId);

  if (item) {
    if (cantidad <= 0) {
      // Eliminar item
      const filteredCart = cart.filter(item => item.productoId !== productoId);
      saveGuestCart(filteredCart);
      return filteredCart;
    } else {
      item.cantidad = cantidad;
      saveGuestCart(cart);
      return cart;
    }
  }

  return cart;
};

/**
 * Eliminar producto del carrito invitado
 */
export const removeFromGuestCart = (productoId) => {
  const cart = getGuestCart();
  const filteredCart = cart.filter(item => item.productoId !== productoId);
  saveGuestCart(filteredCart);
  return filteredCart;
};

/**
 * Limpiar carrito invitado
 */
export const clearGuestCart = () => {
  localStorage.removeItem(GUEST_CART_KEY);
};

/**
 * Obtener cantidad total de items en carrito invitado
 */
export const getGuestCartItemsCount = () => {
  const cart = getGuestCart();
  return cart.reduce((total, item) => total + item.cantidad, 0);
};

/**
 * Fusionar carrito invitado con carrito del usuario autenticado
 */
export const mergeGuestCartToUser = async (usuarioId, carritoAPI) => {
  const guestCart = getGuestCart();
  
  if (guestCart.length === 0) {
    return;
  }

  try {
    // Obtener carrito actual del usuario
    const userCartResponse = await carritoAPI.obtener(usuarioId);
    const userCart = userCartResponse.data;
    const existingItems = userCart?.items || [];

    // Crear mapa de productos existentes en carrito del usuario
    const existingProductMap = new Map();
    existingItems.forEach(item => {
      existingProductMap.set(item.producto.id, item.cantidad);
    });

    // Fusionar items del carrito invitado
    for (const guestItem of guestCart) {
      const existingQty = existingProductMap.get(guestItem.productoId) || 0;
      const newQty = existingQty + guestItem.cantidad;

      try {
        if (existingQty > 0) {
          // Actualizar cantidad existente
          await carritoAPI.actualizar(usuarioId, guestItem.productoId, newQty);
        } else {
          // Agregar nuevo item
          await carritoAPI.agregar(usuarioId, guestItem.productoId, guestItem.cantidad);
        }
      } catch (error) {
        console.error(`Error al fusionar producto ${guestItem.productoId}:`, error);
        // Continuar con el siguiente producto aunque falle uno
      }
    }

    // Limpiar carrito invitado después de fusionar
    clearGuestCart();
  } catch (error) {
    console.error('Error al fusionar carrito invitado:', error);
    throw error;
  }
};

