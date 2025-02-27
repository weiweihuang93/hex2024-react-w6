import axios from "axios"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

export default function AdminOrderPage() {

  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    if(token){
      axios.defaults.headers.common['Authorization'] = token;
      getOrder();
    }else{
      navigate("/login");
    }
  }, []);

  const getOrder = async() => {
    try{
      const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/admin/orders`);
      setOrders(res.data.orders);
    }catch(error){
      alert('訂單取得失敗');
    }
  };

  const delAllOrder = async() => {
    try{
      await axios.delete(`${BASE_URL}/v2/api/${API_PATH}/admin/orders/all`);
      getOrder();
    }catch(error){
      alert('刪除訂單失敗')
    }
  }

  const delOrder = async(id) => {
    try{
      await axios.delete(`${BASE_URL}/v2/api/${API_PATH}/admin/order/${id}`);
      getOrder();
    }catch(error){
      alert('刪除訂單失敗')
    }
  }

  const updateOrder = async(id) => {
    const data = {
      "data": {
        "id": id,
        "is_paid": true,
      }
    }
    try{
      await axios.put(`${BASE_URL}/v2/api/${API_PATH}/admin/order/${id}`, data);
      getOrder();
    }catch(error){
      alert('更新訂單失敗')
    }
  }

  // 時間格式化
  function formatTime(timestamp){
    const time = new Date(timestamp * 1000)
    return time.toLocaleString('zh-TW', {
        hour12: false
    })
  }

  return(
    <>
    <div className="container">
      <div className="row">
        <div className="col">
          <div className="d-flex justify-content-end mt-3 mb-3">
            <button onClick={() => delAllOrder()} type="button" className="btn btn-outline-danger">清除全部訂單</button>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>訂單編號</th>
                <th>聯絡人</th>
                <th>聯絡地址</th>
                <th>電子郵件</th>
                <th>訂單品項</th>
                <th>訂單日期</th>
                <th>訂單狀態</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>
                  <p>{order.user.name}</p>
                  <p>{order.user.tel}</p>
                </td>
                <td>{order.user.address}</td>
                <td>{order.user.email}</td>
                <td>
                  {(Object.values(order.products)).map((item) => (
                    <p key={item.product.title}>{item.product.title} x{item.qty}</p>
                  ))}
                </td>
                <td>{formatTime(order.create_at)}</td>
                <td className="orderStatus">
                  <a onClick={(e) => {
                    e.preventDefault();
                    updateOrder(order.id)}}
                    href="#"
                    style={{ color: order.is_paid ? 'green' : 'red' }} >
                    {order.is_paid ? '已處理': '未處理'}
                  </a>
                </td>
                <td>
                <input onClick={() => delOrder(order.id)} type="button" className="btn btn-outline-danger" value="刪除" />
                </td>
              </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
    </>
  )
}