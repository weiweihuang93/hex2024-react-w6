import { useState, useEffect } from "react";
import axios from "axios";
import ReactLoading from 'react-loading';
import { Link } from "react-router";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

export default function ProductPage(){

  const [products, setProducts] = useState([]);
  const [isScreenLoading, setIsScreenLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getProducts = async () => {
      setIsScreenLoading(true);
      try{
        const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/products`);
        setProducts(res.data.products);
      }catch (error){
        alert('產品載入失敗')
      }finally{
        setIsScreenLoading(false);
      }
    };
    getProducts();
  }, []);

  const addCart = async (product_id, qty) => {
    setIsLoading(true);
    try{
      await axios.post(`${BASE_URL}/v2/api/${API_PATH}/cart`, {
        data: {
          "product_id": product_id,
          "qty": Number(qty)
        }
      });
    }catch (error){
      alert('購物車加入失敗')
    }finally{
      setIsLoading(false);
    }
  };

  return(
    <>
    <div className="container">
      <div className="mt-4">
        {/* 產品列表 */}
        <table className="table align-middle">
          <thead>
            <tr>
              <th>圖片</th>
              <th>商品名稱</th>
              <th>價格</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td style={{ width: "200px" }}>
                  <img src={product.imageUrl} alt={product.title} className="img-fluid"/>
                </td>
                <td>{product.title}</td>
                <td>
                  <del className="h6">原價 {product.origin_price}元</del>
                  <div className="h5">特價 {product.price}元</div>
                </td>
                <td>
                  <div className="btn-group btn-group sm">
                    <Link to={`/product/${product.id}`} type="button" 
                      className="btn btn-outline-secondary">查看更多</Link>
                    <button
                      disabled={isLoading}
                      onClick={() => addCart(product.id, 1)}
                      type="button" 
                      className="btn btn-outline-danger d-flex align-items-center gap-2">
                      <div>加到購物車</div>
                      {isLoading && <ReactLoading type={"spin"} color={"#000"} height={"1.5rem"} width={"1.5rem"} />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            
          </tbody>
        </table>
      </div>

      {isScreenLoading && (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(255,255,255,0.3)",
          zIndex: 999,}}>
        <ReactLoading type="spin" color="black" width="4rem" height="4rem" />
      </div>)}
    </div>
    </>
  )
}