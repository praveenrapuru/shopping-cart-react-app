import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './productsStyles.css';

function Product() {
  const [products, setProducts] = useState({ all: [], filtered: [] });
  const [showCart, setShowCart] = useState(false);
  const [colorChange, setColorChange] = useState(null);
  const [filters, setFilters] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetch('https://react-shopping-cart-67954.firebaseio.com/products.json')
      .then((res) => res.json())
      .then((data) => {
        const allProducts = [...data.products ]
        let list = data.products;
        list = splitChunks(list);
        setProducts({ filtered: list, all: allProducts })
        console.log(products)
      });
  }, []);

  const splitChunks = (arr) => {
    const chunkSize = 4;
    return [...Array(Math.ceil(arr.length / chunkSize))].map(_ => arr.splice(0,chunkSize))
  }

  const sizeAvailable = (newFilters) => {
    return function(product) {
      if(newFilters == []){
        return true
      }
      return newFilters.some(size => product.availableSizes.includes(size));
    }
  }
 
  const filterSize = (size)=>{
      let newFilters = []
      if(filters.includes(size)){
        newFilters = filters.filter((item) => item !== size);
        setFilters(newFilters);
      } else {
        newFilters = [...filters, size]
        setFilters(newFilters);
      }

      const allProducts = [...products.all]
      let filtered = products.all.filter(sizeAvailable(newFilters));
      filtered = splitChunks(filtered);
      setProducts({ all: allProducts, filtered: filtered });
      // setColorChange(size);
  }
  const clickCart = () => {
    setShowCart(!showCart);
  }

  const buttonStyle = (size) =>({
    backgroundColor: filters.includes(size) ? 'black' : '',
    color: filters.includes(size) ? 'white' : '',
  });

  const addToCart = (product) =>{
    setCart((prevCart) => {
      const existingProduct = prevCart.find(item => item.id === product.id);
      if (existingProduct) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  }
  const incrementProducts = (productId) =>{
    setCart((prevCart) => 
      prevCart.map(item =>
        item.id === productId ? {...item, quantity: item.quantity + 1} : item
      )
    );
  };

  const decrementProducts = (productId) =>{
    setCart((prevCart) =>
      prevCart.map(item =>
        item.id === productId && item.quantity > 1 ? {...item, quantity: item.quantity - 1} : item
      )
      .filter(item => item.quantity > 0)
    );
  };
  const removeCart = (productId) => {
    setCart((prevCart) =>
      prevCart.filter(item => item.id !== productId)
    );
  };
  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0 )
  const checkOut = () => {
    alert(`Thank you for your purchase! Your total is ${cart.length > 0 ? `${cart[0].currencyFormat}${totalPrice}` : '$0.00'}`);
  
    setShowCart(false); 
  };
    // [
    //   [{}, {}, {}, {}],
    //   [{}, {}, {}, {}],
    //   [{}, {}, {}, {}],
    //   [{}, {}, {}, {}],
    // ]
  return (
    <div>
      <div className="row">
        <div className='col-2'>
          <h5>Size:</h5>
          <div className="Container ">
            <button onClick={() => filterSize('XS')} className="rounded-circle border-0 Container" style={buttonStyle('XS')}>XS</button>
            <button onClick={() => filterSize('S')} className="rounded-circle border-0 Container" style={buttonStyle('S')}>S</button>
            <button onClick={() => filterSize('M')} className="rounded-circle border-0 Container" style={buttonStyle('M')}>M</button>
            <button onClick={() => filterSize('ML')} className="rounded-circle border-0 Container" style={buttonStyle('ML')}>ML</button>
          </div>
          <div style={{marginTop:'25px'}}>
            <button onClick={() => filterSize('L')} className="rounded-circle border-0 Container" style={buttonStyle('L')}>L</button>
            <button onClick={() => filterSize('XL')} className="rounded-circle border-0 Container" style={buttonStyle('XL')}>XL</button>
            <button onClick={() => filterSize('XXL')} className="rounded-circle border-0 Container" style={buttonStyle('XXL')}>XXL</button>
          
          </div>
        </div>
        <div className='col-9'>
        <h6>{products.filtered.flat().length} Product(s) found</h6>
          {products.filtered.map((productsChunk) => (
            <div className="row">
              {productsChunk.map((product) => (
                <div className='col-3'>
                  <div
                    style={{
                      backgroundImage: `url(${require("../static/products/" + product.sku + "-1-cart.webp")})`,
                      backgroundSize: '60%',
                      height: '270px',
                      position: 'relative',   
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'center center'
                    }}
                    key={product.id}
                  >
                  </div>
                  <h6 style={{textAlign:"center"}}>{product.title}</h6>
                  {/* <span style={{textAlign:'center', color:'rgb(234,192,3)'}}>___</span> */}
                  <div style={{textAlign:'center'}}>
                    <span className="fw-lighter">{product.currencyFormat}</span>
                    <span>{product.price}</span><br/>
                    <button style={{background:"black", color:'white', textAlign:"center"}} onClick={() => addToCart(product)} >Add to cart</button>
                  </div> 
                </div>
              ))}     
            </div>
          ))}
        </div>
        <div className='col-1'>
            <div>
            <button
            onClick={clickCart}
             style={{
              backgroundImage: `url(${require("../static/cart-icon.png")})`,
              backgroundColor: 'black',
              backgroundSize: '82%',
              border:'0',
              height:'50px',
              width:'57px',
              color:'yellow'
             }}
            ></button>
        
            </div>
        </div>
        
        {showCart && ( 
        <div  className="cartPopup">

          <button className='cartbutton' onClick={clickCart}>X</button>
          <h6 style={{color:'white',textAlign:'center'}}>Cart</h6>
          <div >
              {cart.map((item) => (
                <div className='row' style = {{color:'white'}} >
                  <div className='col-2'>
                    <img style={{height:'80px'}} src={require("../static/products/" + item.sku + "-1-cart.webp")}></img>
                  </div>
                  <div className='col-8'>
                    <span>{item.title}</span><br/> 
                    <pre style={{color:'rgb(90,91,92)'}}>
                      <span>{item.availableSizes.join(',')}</span>
                      <span>||</span> 
                      <span>{item.style}</span>
                      <p>Quantity:{item.quantity}</p>
                    </pre>

                  </div>
                  <div className='col-2'>
                    <button className='cartbutton' onClick={() => removeCart(item.id)}>X</button>
                    <span style={{color:'yellow'}}>
                      {item.currencyFormat}{item.price}
                    </span>
                    <div>
                    <button onClick={() => decrementProducts(item.id)} className='cartbutton'>-</button>
                    <button onClick={() => incrementProducts(item.id)} className='cartbutton' style={{position:'absolute'}}>+</button>
                    </div>
                  </div> 
                  </div>
                
              ))}
            </div>
            
              <div className='cart-total'>
                <h5>Total: {cart.length > 0 ? `${cart[0].currencyFormat}${totalPrice}` : '$0.00'}</h5>
                <button onClick={checkOut}>CheckOut</button>
              </div>
        </div>
      )}
      </div>
    </div>

  );
}

export default Product;
