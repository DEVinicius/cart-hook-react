import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MdShoppingBasket } from 'react-icons/md';

import logo from '../../assets/images/logo.svg';
import { Container, Cart } from './styles';
import { useCart } from '../../hooks/useCart';

const Header = (): JSX.Element => {
  const { cart } = useCart();
  const [cartSize, setCartSize] = useState(0);

  const cartAmount = cart.map(product => (
    product.amount
  ));

  const handleGetCartSize = useCallback(async() => {
    const cartSize = cartAmount.length > 0 ? cartAmount.reduce((total, product) => total + product) : 0;

    setCartSize(cartSize)
  }, [setCartSize,cartAmount])

  useEffect(() => {
    handleGetCartSize()
  }, [])

  useEffect(() => {
    handleGetCartSize()
  }, [cart])


  return (
    <Container>
      <Link to="/">
        <img src={logo} alt="Rocketshoes" />
      </Link>

      <Cart to="/cart">
        <div>
          <strong>Meu carrinho</strong>
          <span data-testid="cart-size">
            {cartSize === 1 ? `${cartSize} item` : `${cartSize} itens`}
          </span>
        </div>
        <MdShoppingBasket size={36} color="#FFF" />
      </Cart>
    </Container>
  );
};

export default Header;
