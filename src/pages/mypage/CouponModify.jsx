import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getCouponPresignedUrl,
  updateCoupon,
  uploadCouponImageToS3,
} from "../../apis/CouponApi";
import CouponFormPage from "../../components/mypage/CouponFormPage";

const CouponModify = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const coupon = location.state?.coupon;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const uploadImage = async (imageFile) => {
    const contentType = imageFile.type || "image/jpeg";
    const presignedResponse = await getCouponPresignedUrl({
      fileName: imageFile.name,
      contentType,
    });

    await uploadCouponImageToS3({
      presignedUrl: presignedResponse.presignedUrl,
      file: imageFile,
      contentType,
    });

    return presignedResponse.fileUrl;
  };

  const handleSubmit = async ({
    menuName,
    discountNum,
    discountType,
    imageFile,
    currentImageUrl,
  }) => {
    if (!coupon?.couponId || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const imageUrl = imageFile
        ? await uploadImage(imageFile)
        : currentImageUrl;

      await updateCoupon({
        couponId: coupon.couponId,
        couponForm: {
          imageUrl,
          menuName,
          discountNum,
          discountType,
        },
      });

      navigate("/mypage");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CouponFormPage
      title="쿠폰 수정하기"
      submitLabel="수정하기"
      initialCoupon={coupon}
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit}
    />
  );
};

export default CouponModify;
