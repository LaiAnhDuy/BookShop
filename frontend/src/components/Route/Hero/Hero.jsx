import React from "react";
import styles from "../../../styles/styles";

const Hero = () => {
  return (
    <div
      className="min-h-[70vh] 800px:min-h-[80vh] w-full bg-no-repeat bg-cover flex items-center"
      style={{
        backgroundImage:
          "url(https://namchauims.com/wp-content/uploads/2022/02/5-truyen-tham-tu-lung-danh-conan-conan.jpg)",
      }}
    >
      <div className={`${styles.section} w-[90%] 800px:w-[60%]`}>
        <h1
          className={`text-[35px] text-[#f5f2ca] font-[800] capitalize leading-[1.2] 800px:text-[60px]`}
        >
          Thám tử lừng danh 
		  <span className="text-[#fd2929] font-[800]"> Conan </span>
        </h1>
        <p className="text-md leading-[30px] pt-5 font-Poppins text-white ">
          Truyện xoay quanh một cậu thám tử trung học có tên là Kudo Shinichi
          <br />trong lúc đang điều tra một Tổ chức Áo đen bí ẩn đã bị ép phải uống
          <br />một loại thuốc độc có thể gây chết người. May mắn là cậu đã sống sót
          <br />nhưng cơ thể thì lại bị teo nhỏ như một đứa bé 6 tuổi.
        </p>
        
      </div>
    </div>
  );
};

export default Hero;
