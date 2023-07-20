import React from "react";
import styles from "../../../styles/styles";

const Sponsored = () => {
  return (
    <div
      className={`${styles.section} hidden 400px:block bg-white py-10 px-5 mb-12 cursor-pointer rounded-xl`}
    >
      <div className="flex justify-between w-full">
        <div className="flex items-start ">
          <img
            src="https://upload.wikimedia.org/wikipedia/vi/3/3b/Logo_nxb_Kim_%C4%90%E1%BB%93ng.png"
            alt=""
            className="w-[50px] object-contain lg:w-[150px] "
          />
        </div>
        <div className="flex items-start">
          <img
            src="https://designercomvn.s3.ap-southeast-1.amazonaws.com/wp-content/uploads/2018/09/12031437/top-7-thiet-ke-logo-nha-xuat-ban-sach-dac-sac-001.png"
            alt=""
            className="w-[50px] object-contain lg:w-[150px] "
          />
        </div>
        <div className="flex items-start">
          <img
            src="https://upload.wikimedia.org/wikipedia/vi/c/c1/Logo_NXB_YH.jpg"
            alt=""
            className="w-[50px] object-contain lg:w-[150px] "
          />
        </div>
        <div className="flex items-start">
          <img
            src="https://nxbdantri.com.vn/wp-content/uploads/2020/07/logo_footer.png"
            alt=""
            className="w-[50px] object-contain lg:w-[150px] "
          />
        </div>
        <div className="flex items-start">
          <img
            src="data:image/png;base64,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"
            className="w-[50px] object-contain lg:w-[150px] "
            alt=""
          />
        </div>
      </div>
    </div>
  );
};

export default Sponsored;
