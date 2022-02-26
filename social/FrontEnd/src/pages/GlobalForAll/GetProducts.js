import { useEffect, useState } from "react";
import axios from "axios";
import Product from "../../components/Post/Product";
import { useSelector } from "react-redux";

const GetProducts = ({
  linkOfFetching,
  className,
  body = {},
  //   surfer_info_ready = null,
}) => {
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [finished, setFinished] = useState(false);
  const [fetching, setFetching] = useState(false);
  const { user } = useSelector((s) => s.reducer);
  const asyncFunc = async () => {
    try {
      if (!finished && !fetching) {
        let data;
        data = await axios.patch(
          `${linkOfFetching}?limit=8&page=${page}`,
          body
        );
        data = data.data;
        console.log(data.data);
        if (data.data.length === 0) {
          setFinished(true);
        } else {
          setProducts([...products, ...data.data]);
          setPage((p) => p + 1);
        }
      }
    } catch {
      alert("error");
    }
  };

  const scrollFunc = async () => {
    if (products.length !== 0 && !finished && !fetching) {
      if (
        document.getElementById(`product_id_${products.length - 1}`) &&
        document
          .getElementById(`product_id_${products.length - 1}`)
          .getClientRects()[0].top < 2000
      ) {
        try {
          setFetching(true);
          await asyncFunc();
          setFetching(false);
        } catch {
          alert("error");
        }
      }
    }
  };

  useEffect(() => {
    const func = async () => {
      setFetching(true);
      await asyncFunc();
      setFetching(false);
    };
    func();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.onscroll = scrollFunc;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products.length, fetching, finished]);

  return (
    <>
      {products.map((el, index) => (
        <Product
          id={`product_id_${index}`}
          data={el}
          key={index}
          className={className}
          marketer_info={user}
        />
      ))}
    </>
  );
};
export default GetProducts;
