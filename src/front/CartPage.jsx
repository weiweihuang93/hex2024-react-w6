import { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import ReactLoading from 'react-loading';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

export default function CartPage(){

  const [cart, setCart] = useState({});
  const [isScreenLoading, setIsScreenLoading] = useState(false);

  useEffect(() => {
    getCart();
  }, []);

  const getCart = async () => {
    setIsScreenLoading(true);
    try{
      const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/cart`);
      setCart(res.data.data);
    }catch (error){
      alert('購物車載入失敗')
    }finally{
      setIsScreenLoading(false);
    }
  };

  const delAllCart = async () => {
    setIsScreenLoading(true);
    try{
      await axios.delete(`${BASE_URL}/v2/api/${API_PATH}/carts`);
      getCart();
    }catch (error){
      alert('購物車清空失敗')
    }finally{
      setIsScreenLoading(false);
    }
  };

  const delIdCart = async (cart_id) => {
    setIsScreenLoading(true);
    try{
      await axios.delete(`${BASE_URL}/v2/api/${API_PATH}/cart/${cart_id}`);
      getCart();
    }catch (error){
      alert('單項商品刪除失敗')
    }finally{
      setIsScreenLoading(false);
    }
  };

  const updateQtyCart = async (cart_id, product_id, qty) => {
    setIsScreenLoading(true);
    try{
      await axios.put(`${BASE_URL}/v2/api/${API_PATH}/cart/${cart_id}`, {
        data: {
          "product_id": product_id,
          "qty": Number(qty)
        }
      });
      getCart();
    }catch (error){
      alert('購物車更新數量失敗')
    }finally{
      setIsScreenLoading(false);
    }
  };

  const { 
    register,
    handleSubmit,
    reset,
    formState: { errors }
   } = useForm({ mode: "onBlur" });

   const onSubmit = (data) => {
    const { message, ...user } = data;
    const userData = {
      data: {
        user,
        message
      }
    };
    submitOrder(userData);
    reset(); // 清空表單
   };

   const submitOrder = async (data) => {
    setIsScreenLoading(true);
    try{
      const res = await axios.post(`${BASE_URL}/v2/api/${API_PATH}/order`, data)
      alert(res.data.message); //"已建立訂單"
      getCart();
    }catch (error){
      const errorMessage = error.response?.data?.message || '未知錯誤';
      alert(`結帳失敗: ${errorMessage}`);
    }finally{
      setIsScreenLoading(false);
    }
   };

  return(
    <>
    <div className="container">
      <div className="mt-4">
        {/* 購物車 */}
        {cart.carts?.length > 0 ? 
        (<>
          <div className="text-end py-3">
            <button
              onClick={delAllCart}
              className="btn btn-outline-danger" type="button">
              清空購物車
            </button>
          </div>

          <table className="table align-middle">
            <thead>
              <tr>
                <th></th>
                <th>品名</th>
                <th style={{ width: "150px" }}>數量/單位</th>
                <th className="text-end">單價</th>
              </tr>
            </thead>
            <tbody>
              {cart.carts?.map((cart) => (
              <tr key={cart.id}>
                <td>
                  <button
                    onClick={() => delIdCart(cart.id)}
                    type="button" className="btn btn-outline-danger btn-sm">
                    x
                  </button>
                </td>
                <td>{cart.product.title}</td>
                <td style={{ width: "150px" }}>
                  <div className="d-flex align-items-center">
                    <div className="btn-group me-2" role="group">
                      <button
                        onClick={() => updateQtyCart(cart.id, cart.product_id, cart.qty - 1)}
                        disabled={cart.qty === 1}
                        type="button"
                        className="btn btn-outline-dark btn-sm">
                        -
                      </button>
                      <span
                        className="btn border border-dark"
                        style={{ width: "50px", cursor: "auto" }}>
                          {cart.qty}
                      </span>
                      <button
                        onClick={() => updateQtyCart(cart.id, cart.product_id, cart.qty + 1)}
                        type="button"
                        className="btn btn-outline-dark btn-sm">
                        +
                      </button>
                    </div>
                    <span className="input-group-text bg-transparent border-0">
                      {cart.product.unit}
                    </span>
                  </div>
                </td>
                <td className="text-end">{cart.total}</td>
              </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3" className="text-end">
                  總計：
                </td>
                <td className="text-end" style={{ width: "130px" }}>{cart.total}</td>
              </tr>
            </tfoot>
          </table>
        </>) : 
        (<>
        <h3>購物車無商品</h3>
        </>)}

        {/* Form表單 */}
        <div className="my-5 row justify-content-center">
          <form onSubmit={handleSubmit(onSubmit)} className="col-md-6">
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                {...register('email', {
                  required: 'Email 欄位必填',
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: 'Email 格式錯誤'
                  }
                })}
                id="email"
                type="email"
                className={`form-control ${errors.email && 'is-invalid'}`}
                placeholder="請輸入 Email" />
                
                {errors?.email && <p className="text-danger my-2">{errors.email.message}</p>}
            </div>

            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                收件人姓名
              </label>
              <input
                {...register('name', {
                  required: '姓名 欄位必填'
                })}
                id="name"
                className={`form-control ${errors.name && 'is-invalid'}`}
                placeholder="請輸入姓名" />

              {errors?.name && <p className="text-danger my-2">{errors.name.message}</p>}
            </div>

            <div className="mb-3">
              <label htmlFor="tel" className="form-label">
                收件人電話
              </label>
              <input
                {...register('tel', {
                  required: '電話 欄位必填',
                  pattern: {
                    value: /^(0[2-8]\d{7}|09\d{8})$/,
                    message: '電話 格式錯誤'
                  }
                })}
                id="tel"
                type="tel"
                className={`form-control ${errors.tel && 'is-invalid'}`}
                placeholder="請輸入電話" />

              {errors?.tel && <p className="text-danger my-2">{errors.tel.message}</p>}
            </div>

            <div className="mb-3">
              <label htmlFor="address" className="form-label">
                收件人地址
              </label>
              <input
                {...register('address', {
                  required: '地址 欄位必填'
                })}
                id="address"
                type="text"
                className={`form-control ${errors.address && 'is-invalid'}`}
                placeholder="請輸入地址" />

              {errors?.address && <p className="text-danger my-2">{errors.address.message}</p>}
            </div>

            <div className="mb-3">
              <label htmlFor="message" className="form-label">
                留言
              </label>
              <textarea
                {...register('message')}
                id="message"
                className="form-control"
                cols="30"
                rows="10">
              </textarea>
            </div>
            <div className="text-end">
              <button type="submit" className="btn btn-danger" disabled={cart.carts?.length === 0}>
                送出訂單
              </button>
            </div>
          </form>
        </div>
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