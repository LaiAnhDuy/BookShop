import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../../styles/styles";
import { AiOutlineMessage, AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { backend_url } from "../../server";
import { useDispatch, useSelector } from "react-redux";
import { getAllProductsShop } from "../../redux/actions/product";
// import Zoom from 'react-medium-image-zoom';
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { addToCart } from "../../redux/actions/cart";
import { toast } from "react-toastify";
import Rating from "@material-ui/lab/Rating";
import axios from "../../redux/actions/axiosConfig";

const ProductDetails = ({ data }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.product);
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const { cart } = useSelector((state) => state.cart);
  useEffect(() => {
    dispatch(getAllProductsShop(data?.shop._id));
  }, [dispatch, data]);
  // console.log(data.id);
  const [count, setCount] = useState(1);
  const [click, setClick] = useState(false);
  const [select, setSelect] = useState(0);
  const decrementCount = () => {
    if (count > 1) setCount(count - 1);
  };
  const incrementCount = () => {
    setCount(count + 1);
  };
  const addToWishlistHandler = () => {
    setClick(!click);
  };
  const removeFromWishlistHandler = () => {
    setClick(!click);
  };
  console.log(typeof data.shop.createdAt);
  const addToCartHandle = () => {
    const isExists = cart.some((item) => item._id == data._id);
    if (isExists) {
      toast.error("item already exists in cart");
    } else {
      dispatch(addToCart({ ...data, qty: count }));
      toast.success("item is added to cart");
    }
  };

  const sendMessageHandler = async () => {
    if (!isAuthenticated) {
      return toast.error("Please login to chat with the seller");
    }
    const groupTitle = data._id + user._id;
    try {
      const response = await axios.post(
        "/conversation/create-new-conversation",
        {
          groupTitle,
          userId: user._id,
          sellerId: data.shop._id,
        }
      );
      // console.log(2);

      navigate(`/inbox?${response.data.conversation._id}`);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const [avg, setAvg] = useState(0);
  const [totalReviewsLength, setTotalReviewsLength] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    setTotalProducts(products?.length);
    let totalReviewsLength = 0;
    let totalReviewsRating = 0;
    if (products && products.length > 0) {
      for (let product of products) {
        if (product.reviews && product.reviews.length > 0) {
          const length = product.reviews.length;
          totalReviewsLength += length;
          totalReviewsRating += product.ratings * length;
        }
      }
    }

    if (totalReviewsLength) {
      setTotalReviewsLength(totalReviewsLength);
      setAvg(totalReviewsRating / totalReviewsLength);
    }
  }, [products]);

  return (
    <div className="bg-white pb-8">
      {data && (
        <div className={`${styles.section} w-[90%] 800px:w-[80%]`}>
          <div className="w-full py-5 800px:flex ">
            <div className="w-full 800px:w-[50%]">
              <Zoom>
                <div className="w-[80%] pt-[56.25%] relative overflow-hidden ">
                  <img
                    className=" block w-full h-full  object-cover absolute top-0 left-0"
                    alt=""
                    src={
                      data && data.images && backend_url + data.images[select]
                    }
                  ></img>
                </div>
              </Zoom>
              <div className="w-[80%]  flex justify-center flex-wrap">
                {data &&
                  data.images?.map((i, index) => (
                    <div
                      className={`${
                        select === index
                          ? "border-[2px] border-gray-500 w-[70px] h-[70px]"
                          : "w-[70px] h-[70px]"
                      } cursor-pointer m-1 `}
                    >
                      <img
                        className="w-full h-full object-cover"
                        src={backend_url + i}
                        alt=""
                        onClick={() => setSelect(index)}
                      />
                    </div>
                  ))}
              </div>
            </div>

            <div className="w-full 800px:w-[50%] p-1">
              <h1 className={styles.productTitle}>{data.name}</h1>
              <p>{data.description}</p>
              <div className="flex pt-3">
                <h4 className={`${styles.productDiscountPrice}`}>
                  {data.discountPrice}$
                </h4>
                <h3 className={`${styles.price}`}>
                  {data.originalPrice ? data.originalPrice + "$" : null}
                </h3>
              </div>
              <div className="flex items-center justify-between mt-12 pr-1">
                <div className="flex items-center">
                  <button
                    onClick={decrementCount}
                    className="w-[40px] h-[40px] bg-green-500 text-[20px] rounded"
                  >
                    -
                  </button>
                  <button className="w-[43px] h-[43px] bg-gray-400 text-[20px] rounded">
                    {count}
                  </button>
                  <button
                    onClick={incrementCount}
                    className="w-[40px] h-[40px] bg-green-500 text-[20px] rounded"
                  >
                    +
                  </button>
                </div>
                <div>
                  {click ? (
                    <AiFillHeart
                      size={30}
                      className="cursor-pointer"
                      onClick={() => removeFromWishlistHandler(data)}
                      color={click ? "red" : "#333"}
                      title="Remove from wishlist"
                    />
                  ) : (
                    <AiOutlineHeart
                      size={30}
                      className="cursor-pointer"
                      onClick={() => addToWishlistHandler(data)}
                      title="Add to wishlist"
                    />
                  )}
                </div>
              </div>
              <div
                className={`${styles.button} text-white mt-5 rounded-sm`}
                onClick={addToCartHandle}
              >
                Add to cart
              </div>
              <div className="flex justify-between items-center">
                <Link to={`/shop/preview/${data.shop._id}`} className="flex">
                  <img
                    alt=""
                    className="mr-2 w-[50px] h-[50px] rounded-full object-cover"
                    src={backend_url + data.shop.avatar}
                  ></img>
                  <div className="h-[50px]">
                    <h3 className={styles.shop_name}>{data.shop.name}</h3>
                    <h5 className=" mt-[-10px] text-[15px]">
                      ({data.ratings}) Ratings
                    </h5>
                  </div>
                </Link>
                <div
                  className={`${styles.button} bg-[#000] mt-7 rounded-[4px] h-11`}
                  onClick={sendMessageHandler}
                >
                  <span className="text-white">
                    Send message{" "}
                    <AiOutlineMessage className="ml-1 inline-block" />
                  </span>
                </div>
              </div>
            </div>
          </div>
          <ProductDetailsInfo
            data={data}
            avg={avg}
            totalReviewsLength={totalReviewsLength}
            totalProducts={totalProducts}
          />
        </div>
      )}
    </div>
  );
};

const ProductDetailsInfo = ({
  data,
  avg,
  totalReviewsLength,
  totalProducts,
}) => {
  const [active, setActive] = useState(1);
  return (
    <div className="bg-gray-100 mb-[30px] px-3 min-h-[40vh]  800px:px-10 py-2 rounded">
      <div className="w-full flex justify-between border-b pt-10 pb-2">
        <div>
          <h5
            className={`${
              active === 1 ? "border-b-[4px] border-red-600" : ""
            } text-black text-[18px] leading-5 px-1 font-600 cursor-pointer 800px:text-[20px]`}
            onClick={() => {
              setActive(1);
            }}
          >
            Product Details
          </h5>
        </div>
        <div>
          <h5
            className={`${
              active === 2 ? "border-b-[4px] border-red-600" : ""
            } text-black text-[18px] leading-5 px-1 font-600 cursor-pointer 800px:text-[20px]`}
            onClick={() => {
              setActive(2);
            }}
          >
            Product Reviews
          </h5>
        </div>
        <div>
          <h5
            className={`${
              active === 3 ? "border-b-[4px] border-red-600" : ""
            } text-black text-[18px] leading-5 px-1 font-600 cursor-pointer 800px:text-[20px]`}
            onClick={() => {
              setActive(3);
            }}
          >
            Seller Information
          </h5>
        </div>
      </div>
      {active === 1 ? (
        <>
          <p className="min-h-[40vh] py-2 text-[18px] leading-8 pb-10 whitespace-pre-line">
            {data.description}
          </p>
        </>
      ) : null}
      {active === 2 ? (
        <div className="h-[40vh] overflow-y-scroll ">
          {data.reviews?.length ? (
            <div>
              {data.reviews.map((review) => {
                return (
                  <div className="py-2 border-b ">
                    <div className="flex ">
                      <img
                        src={backend_url + review.user.avatar}
                        alt=""
                        className=" block w-[50px] h-[50px] rounded-full"
                      />
                      <div className=" pl-2">
                        <div className="h-[70px] flex flex-col justify-between pb-2	">
                          <h1>{review.user.name}</h1>
                          <Rating
                            name="read-only"
                            value={+review.rating}
                            readOnly
                          />
                          <p className="text-[12px]">
                            {review.createdAt.slice(0, 16)}
                          </p>
                        </div>
                        <div>
                          <p>{review.comment}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex w-full h-full items-center justify-center">
              no reviews yet
            </div>
          )}
        </div>
      ) : null}
      {active === 3 ? (
        <div className="min-h-[40vh] w-full 800px:flex">
          <div className="w-full p-5 800px:w-[50%]">
            <Link
              to={`/shop/preview/${data.shop._id}`}
              className="flex w-full flex-wrap"
            >
              <img
                alt=""
                className="mr-2 w-[50px] h-[50px] rounded-full object-cover"
                src={backend_url + data.shop.avatar}
              ></img>
              <div className="h-[50px]">
                <h3 className={styles.shop_name}>{data.shop.name}</h3>
                <h5 className=" mt-[-10px] text-[15px]">{avg} Ratings</h5>
              </div>
              <div className="w-full pt-5">
                <p>{data.shop.description}</p>
              </div>
            </Link>
          </div>
          <div className=" p-5  w-full 800px:w-[50%] 800px:flex justify-end">
            <div className="text-left mt-5">
              <h5 className="font-[600] ">
                Joined on:{" "}
                <span className="font-[500]">
                  {new Date(data.shop.createdAt)?.toISOString().slice(0, 10)}
                </span>
              </h5>
              <h5 className="font-[600] pt-3">
                Total Products:{" "}
                <span className="font-[500]"> {totalProducts}</span>
              </h5>
              <h5 className="font-[600] pt-3">
                Total Reviews:{" "}
                <span className="font-[500]">{totalReviewsLength} </span>
              </h5>
              <Link to={`/shop/preview/${data.shop._id}`}>
                <div className={`${styles.button} !rounded-[4px]`}>
                  <h4 className="text-white ">Visit Shop</h4>
                </div>
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ProductDetails;
