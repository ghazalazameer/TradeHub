import Product from "@/models/Product";
import User from "../../models/User";
import Category from "@/models/Category";
import SubCategory from "@/models/SubCategory";
import styles from "../../styles/product.module.scss";
import db from "@/utils/db";
import Head from "next/head";
import Header from "@/components/header";
import Footer from "@/components/footer";
import MainSwiper from "@/components/productPage/mainSwiper";
import { useState } from "react";
import Infos from "@/components/productPage/infos";
import Reviews from "@/components/productPage/reviews";

export default function Products({ product }) {
  const [activeImg, setActiveImg] = useState("");
  const country = {
    name: "India",
    flag: "https://cdn.ipregistry.co/flags/emojitwo/in.svg",
  };

  return (
    <div>
      <Head>
        <title>{product.name}</title>
      </Head>
      <Header country={country} />
      <div className={styles.product}>
        <div className={styles.product__container}>
          <div className={styles.path}>
            Home/ {product.category?.name}/
            {product.subCategories.map((sub, index) => (
              <span key={index}>/{sub.name}</span>
            ))}
          </div>
          <div className={styles.product__main}>
            <MainSwiper images={product.images} activeImg={activeImg} />
            <Infos product={product} setActiveImg={setActiveImg} />
          </div>
          <Reviews product={product} />
        </div>
      </div>
      {/* <Footer country={country.name} /> */}
    </div>
  );
}
export async function getServerSideProps(context) {
  const { query } = context;
  const slug = query.slug;
  const style = query.style;
  const size = query.size || 0;
  db.connectDb();
  // ...........
  let product = await Product.findOne({ slug })
    .populate({ path: "category", model: Category })
    .populate({ path: "subCategories", model: SubCategory })
    .populate({ path: "reviews.reviewBy", model: User })
    .lean();
  let subProduct = product.subProducts[style];
  let prices = subProduct.sizes
    .map((s) => {
      return s.price;
    })
    .sort((a, b) => {
      return a - b;
    });

  let newProduct = {
    ...product,
    style,
    images: subProduct.images,
    sizes: subProduct.sizes,
    discount: subProduct.discount,
    sku: subProduct.sku,
    colors: product.subProducts.map((p) => {
      return p.color;
    }),
    priceRange: subProduct.discount
      ? `From ${(prices[0] - prices[0] / subProduct.discount).toFixed(2)} to ${(
          prices[prices.length - 1] -
          prices[prices.length - 1] / subProduct.discount
        ).toFixed(2)}$`
      : `From ${prices[0]} to ${prices[prices.length - 1]}$`,
      price:
      subProduct.discount > 0
        ? (
            subProduct.sizes[size].price -
            subProduct.sizes[size].price / subProduct.discount
          ).toFixed(2)
        : subProduct.sizes[size].price,
        priceBefore: subProduct.sizes[size].price,
        quantity: subProduct.sizes[size].qty,
    ratings: [
      {
        percentage: "76",
      },
      {
        percentage: "14",
      },
      {
        percentage: "6",
      },
      {
        percentage: "4",
      },
      {
        percentage: "0",
      },
    ],
    reviews: product.reviews.reverse(),
    allSizes: product.subProducts
      .map((p) => {
        return p.sizes;
      })
      .flat()
      .sort((a, b) => {
        return a.size - b.size;
      })
      .filter(
        (element, index, array) =>
          array.findIndex((el2) => el2.size === element.size) === index
      ),
  };
  // ...........
  // console.log("newProduct",newProduct);
  db.disconnectDb();
  return {
    props: {
      product: JSON.parse(JSON.stringify(newProduct)),
    },
  };
}