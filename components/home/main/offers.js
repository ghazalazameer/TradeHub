import styles from "./styles.module.scss";
import Image from "next/image";
import { offersAarray } from "../../../data/home";
import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Navigation } from "swiper/modules";
import Link from "next/link";

export default function Offers() {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText("trade26")
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  return (
    <div className={styles.offers}>
      <div className={styles.offers__text}>
        <p onClick={copyToClipboard} style={{ cursor: "pointer" }}>
          use code <b>“trade26”</b> for 30% off all products.
        </p>
        {isCopied && (
          <span style={{ color: "green" }}>Coupon code copied!</span>
        )}
        <Link href="/browse">Shop now</Link>
      </div>
      <Swiper
        slidesPerView={3}
        spaceBetween={10}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Pagination, Navigation]}
        className="offers_swiper"
      >
        {offersAarray.map((offer, index) => (
          <SwiperSlide key={index}>
            <Link href="">
              <img src={offer.image} alt="" />
            </Link>
            <span>₹{offer.price}</span>
            <span>-{offer.discount}%</span>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}