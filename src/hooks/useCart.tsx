import { createContext, ReactNode, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { showToast } from '../components/Toast';
import { api } from '../services/api';
import { Product, Stock } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
  const storagedCart = localStorage.getItem("@RocketShoes:cart");

    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return [];
  });

  const addProduct = async (productId: number) => {
    try {
      const product = await api.get<Product>(`/products/${productId}`);

      const checkProductAlreadyExists = cart.find(product => product.id === productId);

      if(checkProductAlreadyExists) {
          const getProductStock = await api.get<Stock>(`/stock/${productId}`)

          if(getProductStock.data.amount < checkProductAlreadyExists.amount + 1) {
            showToast({
              type: 'error',
              message: 'Quantidade solicitada fora de estoque'
            })

            throw("Erro na adição do produto")
          }

          checkProductAlreadyExists.amount = checkProductAlreadyExists.amount + 1;
          const newCart = cart.map(product => product.id === productId ? {
            ...product,
            amount: checkProductAlreadyExists.amount
          }:product)
          localStorage.setItem("@RocketShoes:cart", JSON.stringify(newCart));

      } else {
        product.data.amount = 1;
        setCart([...cart, product.data]);
        localStorage.setItem("@RocketShoes:cart", JSON.stringify(product.data));
      }
    } catch {
      showToast({
        type:"error",
        message:"Erro na adição do produto"
      })
    }
  };

  const removeProduct = (productId: number) => {
    try {
      const findProduct = cart.find(product => product.id === productId);

      if(!findProduct) {
        throw("")
      }

      const newCart = cart.filter(product => product.id != productId);

      localStorage.setItem("@RocketShoes:cart", JSON.stringify(newCart))
      setCart(newCart)
      showToast({
        type: "success",
        message: "Produto Removido com sucesso"
      })
    } catch {
      toast.error('Erro na remoção do produto')
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      //search on api the stock
      const getProductStock = await api.get<Stock>(`/stock/${productId}`)

      if(getProductStock.data.amount < amount || getProductStock.data.amount < 1) {
        throw("Quantitdade solicitada fora de estoque")
      }

      const newCart = cart.map(product => product.id === productId ? {
        ...product,
        amount
      } : product)

      setCart(newCart)
      localStorage.setItem("@RocketShoes:cart", JSON.stringify(newCart))
    } catch {
      toast.error("Erro na alteração de quantidade do produto")
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
