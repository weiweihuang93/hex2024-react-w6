import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { Modal } from "bootstrap";
import { useNavigate } from "react-router";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

const defaultModalState = {
  imageUrl: "",
  title: "",
  category: "",
  unit: "",
  origin_price: "",
  price: "",
  description: "",
  content: "",
  is_enabled: 0,
  imagesUrl: [""]
};

export default function AdminProductPage() {

  const navigate = useNavigate();

  useEffect(() => {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    if(token){
      axios.defaults.headers.common['Authorization'] = token;
      getProduct();
    }else{
      navigate("/login");
    }
  }, []);

  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({});

  const getProduct = async (page = 1) => {
    try {
      const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/admin/products?page=${page}`);
      setProducts(res.data.products);
      setPagination(res.data.pagination);
    } catch (error) {
      alert('取得產品失敗');
    }
  };

  const productModalRef = useRef(null);
  const delproductModalRef = useRef(null);
  const [modalMode, setModalMode] = useState('');
  const [tempProduct, setTempProduct] = useState(defaultModalState);

  useEffect(() => {
    new Modal(productModalRef.current, {
      backdrop: false
    });

    new Modal(delproductModalRef.current, {
      backdrop: false
    });
  }, []);

  const openModal = (mode, product) => {
    setModalMode(mode);
    switch (mode) {
      case 'create':
        setTempProduct({ ...defaultModalState });
        break;

      case 'edit':
        setTempProduct(product);
        break;

      default:
        break;
    }
    const modalInstance = Modal.getInstance(productModalRef.current);
    modalInstance.show();
  };

  const closeModal = () => {
    const modalInstance = Modal.getInstance(productModalRef.current);
    modalInstance.hide();
  };

  const delopenModal = (product) => {
    setTempProduct(product)
    const modalInstance = Modal.getInstance(delproductModalRef.current);
    modalInstance.show();
  };

  const delcloseModal = () => {
    const modalInstance = Modal.getInstance(delproductModalRef.current);
    modalInstance.hide();
  };

  const handleModalInputChange = (e) => {
    const { name, value, type, checked} = e.target;
    setTempProduct({
      ...tempProduct,
      [name]: type === 'checkbox' ? checked : value
    })
  };

  const handleImageChange = (e, index) => {
    const { value } = e.target;
    const newImages = [...tempProduct.imagesUrl];
    newImages[index] = value;

    setTempProduct({
      ...tempProduct,
      imagesUrl: newImages
    })
  };

  const handleAddImage = () => {
    const newImages = [...tempProduct.imagesUrl, ''];
    setTempProduct({
      ...tempProduct,
      imagesUrl: newImages
    })
  };

  const handleRemoveImage = () => {
    const newImages = [...tempProduct.imagesUrl];
    newImages.pop();
    setTempProduct({
      ...tempProduct,
      imagesUrl: newImages
    })
  };

  const createProduct = async () => {
    try {
      await axios.post(`${BASE_URL}/v2/api/${API_PATH}/admin/product`, {
        data: {
          ...tempProduct,
          origin_price: Number(tempProduct.origin_price),
          price: Number(tempProduct.price),
          is_enabled: tempProduct.is_enabled ? 1 : 0
        }
      });
      closeModal();
    } catch (error) {
      throw error;
    }
  };

  const editProduct = async () => {
    try {
      await axios.put(`${BASE_URL}/v2/api/${API_PATH}/admin/product/${tempProduct.id}`, {
        data: {
          ...tempProduct,
          origin_price: Number(tempProduct.origin_price),
          price: Number(tempProduct.price),
          is_enabled: tempProduct.is_enabled ? 1 : 0
        }
      });
      closeModal();
    } catch (error) {
      throw error;
    }
  };

  const handleUpdateProduct = async () => {
    const apiCall = modalMode === 'create' ? createProduct : editProduct;
    try {
      await apiCall();
      getProduct();
    } catch (error) {
      const errorMessage = error.response?.data?.message || '發生未知錯誤';
      alert(`新增產品失敗: ${errorMessage}`);
    }
  };

  const delProduct = async () => {
    try {
      await axios.delete(`${BASE_URL}/v2/api/${API_PATH}/admin/product/${tempProduct.id}`);
      getProduct();
      delcloseModal();
    } catch (error) {
      alert('刪除產品失敗');
    }
  };

  const handlePageChange = (e, page) => {
    e.preventDefault();
    getProduct(page);
  }
  const handleFileChange = async (e) => {
    const formData = new FormData();
    const fileInput = e.target;
    const file = e.target.files[0];
    formData.append('file-to-upload', file);
    try {
      const res = await axios.post(`${BASE_URL}/v2/api/${API_PATH}/admin/upload`, formData);
      const uploadImageUrl = res.data.imageUrl;
      setTempProduct({
        ...tempProduct,
        imageUrl: uploadImageUrl
      })
      fileInput.value = '';
    } catch (error) {
    }
  }

  return(
    <>
    <div className="container">
      <div className="row">
        <div className="col">
          <div className="d-flex justify-content-end mt-3 mb-3">
            <button onClick={() => openModal('create')} type="button" className="btn btn-primary">建立新的產品</button>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">產品名稱</th>
                <th scope="col">原價</th>
                <th scope="col">售價</th>
                <th scope="col">是否啟用</th>
                <th scope="col">查看細節</th>
              </tr>
            </thead>
            <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <th scope="row">{product.title}</th>
                <td>{product.origin_price}</td>
                <td>{product.price}</td>
                <td
                  style={{
                    color: product.is_enabled ? 'green' : 'red',
                    fontWeight: 'bold',
                  }}>
                  {product.is_enabled ? '啟用' : '未啟用'}
                </td>
                <td>
                  <div className="btn-group">
                    <button onClick={() => openModal('edit', product)}  type="button" className="btn btn-outline-primary btn-sm">編輯</button>
                    <button onClick={() => delopenModal(product)} type="button" className="btn btn-outline-danger btn-sm">刪除</button>
                  </div>
                </td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 分頁 */}
      <div className="d-flex justify-content-center">
        <nav>
          <ul className="pagination">
            <li className="page-item">
              <a 
                onClick={(e) => handlePageChange(e, pagination.current_page - 1)}
                className={`page-link ${pagination.has_pre ? '' : 'disabled'}`} 
                href="#">
                上一頁
              </a>
            </li>
            {Array.from({ length: pagination.total_pages }).map((_, index) => (
              <li key={index} className="page-item" >
                <a 
                  onClick={(e) => handlePageChange(e, index + 1)}
                  className={`page-link ${pagination.current_page === index + 1 ? 'active' : ''}`} 
                  href="#" >
                  {index + 1}
                </a>
              </li>
            ))}

            <li className="page-item" >
              <a
                onClick={(e) => handlePageChange(e, pagination.current_page + 1)}
                className={`page-link ${pagination.has_next ? '' : 'disabled'}`}
                href="#">
                下一頁
              </a>
            </li>
          </ul>
        </nav>
      </div>

    </div>

      {/* Modal */}
      <div ref={productModalRef} id="productModal" className="modal" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
        <div className="modal-dialog modal-dialog-centered modal-xl">
          <div className="modal-content border-0 shadow">
            <div className="modal-header border-bottom">
              <h5 className="modal-title fs-4">{modalMode === 'create' ? '新增產品': '編輯產品'}</h5>
              <button onClick={closeModal} type="button" className="btn-close" aria-label="Close"></button>
            </div>

            <div className="modal-body p-4">
              <div className="row g-4">
                <div className="col-md-4">
                  {/* 圖片上傳 */}
                  <div className="mb-5">
                    <label htmlFor="fileInput" className="form-label"> 圖片上傳 </label>
                    <input
                      onChange={handleFileChange}
                      type="file"
                      accept=".jpg,.jpeg,.png"
                      className="form-control"
                      id="fileInput"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="primary-image" className="form-label">
                      主圖
                    </label>
                    <div className="input-group">
                      <input
                        value={tempProduct.imageUrl}
                        onChange={handleModalInputChange}
                        name="imageUrl"
                        type="text"
                        id="primary-image"
                        className="form-control"
                        placeholder="請輸入圖片連結"
                      />
                    </div>
                    <img
                      src={tempProduct.imageUrl}
                      alt={tempProduct.title}
                      className="img-fluid"
                    />
                  </div>

                  {/* 副圖 */}
                  <div className="border border-2 border-dashed rounded-3 p-3">
                  {tempProduct.imagesUrl?.map((image, index) => (
                    <div key={index}>
                      <label htmlFor={`images-${index + 1}`} className="form-label">副圖 {index + 1}</label>
                      <input
                        value={image}
                        onChange={(e) => handleImageChange(e, index)}
                        id={`images-${index + 1}`} type="text" className="form-control" placeholder={`圖片網址-${index + 1}`} />
                      {image && (
                        <img 
                          src={image}
                          alt={`副圖 ${index + 1}`}
                          className="img-fluid mb-2"/>
                      )}
                    </div>
                  ))}

                    <div className="btn-group w-100">
                      {tempProduct.imagesUrl.length < 5 && tempProduct.imagesUrl.length[tempProduct.imagesUrl.length - 1] !== "" && 
                      (<button onClick={handleAddImage} className="btn btn-outline-primary btn-sm w-100">新增圖片</button>)}
                      {tempProduct.imagesUrl.length > 1 && 
                      (<button onClick={handleRemoveImage} className="btn btn-outline-danger btn-sm w-100">取消圖片</button>)}
                    </div>
                  </div>
                </div>

                <div className="col-md-8">
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">
                      標題
                    </label>
                    <input
                      value={tempProduct.title}
                      onChange={handleModalInputChange}
                      name="title"
                      id="title"
                      type="text"
                      className="form-control"
                      placeholder="請輸入標題"
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="category" className="form-label">
                      分類
                    </label>
                    <input
                      value={tempProduct.category}
                      onChange={handleModalInputChange}
                      name="category"
                      id="category"
                      type="text"
                      className="form-control"
                      placeholder="請輸入分類"
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="unit" className="form-label">
                      單位
                    </label>
                    <input
                      value={tempProduct.unit}
                      onChange={handleModalInputChange}
                      name="unit"
                      id="unit"
                      type="text"
                      className="form-control"
                      placeholder="請輸入單位"
                    />
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-6">
                      <label htmlFor="origin_price" className="form-label">
                        原價
                      </label>
                      <input
                        value={tempProduct.origin_price}
                        onChange={handleModalInputChange}
                        name="origin_price"
                        id="origin_price"
                        type="number"
                        className="form-control"
                        placeholder="請輸入原價"
                        min="0" // 限制最小值為 0
                      />
                    </div>
                    <div className="col-6">
                      <label htmlFor="price" className="form-label">
                        售價
                      </label>
                      <input
                        value={tempProduct.price}
                        onChange={handleModalInputChange}
                        name="price"
                        id="price"
                        type="number"
                        className="form-control"
                        placeholder="請輸入售價"
                        min="0" // 限制最小值為 0
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">
                      產品描述
                    </label>
                    <textarea
                      value={tempProduct.description}
                      onChange={handleModalInputChange}
                      name="description"
                      id="description"
                      className="form-control"
                      rows={4}
                      placeholder="請輸入產品描述"
                    ></textarea>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="content" className="form-label">
                      說明內容
                    </label>
                    <textarea
                      value={tempProduct.content}
                      onChange={handleModalInputChange}
                      name="content"
                      id="content"
                      className="form-control"
                      rows={4}
                      placeholder="請輸入說明內容"
                    ></textarea>
                  </div>

                  <div className="form-check">
                    <input
                      checked={tempProduct.is_enabled}
                      onChange={handleModalInputChange}
                      name="is_enabled"
                      type="checkbox"
                      className="form-check-input"
                      id="isEnabled"
                    />
                    <label className="form-check-label" htmlFor="isEnabled">
                      是否啟用
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer border-top bg-light">
              <button onClick={closeModal} type="button" className="btn btn-secondary">
                取消
              </button>
              <button onClick={handleUpdateProduct} type="button" className="btn btn-primary">
                確認
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 刪除 Modal */}
      <div
        ref={delproductModalRef}
        className="modal fade"
        id="delProductModal"
        tabIndex="-1"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5">刪除產品</h1>
              <button
                onClick={delcloseModal}
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              你是否要刪除 
              <span className="text-danger fw-bold">{tempProduct.title}</span>
            </div>
            <div className="modal-footer">
              <button
                onClick={delcloseModal}
                type="button"
                className="btn btn-secondary"
              >
                取消
              </button>
              <button
                onClick={delProduct}
                type="button" className="btn btn-danger">
                刪除
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}