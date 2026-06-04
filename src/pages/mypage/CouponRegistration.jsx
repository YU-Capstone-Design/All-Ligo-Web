import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createCoupon,
  getCouponPresignedUrl,
  uploadCouponImageToS3,
} from "../../apis/CouponApi";
import CouponFormPage from "../../components/mypage/CouponFormPage";

const CouponRegistration = () => {
  const navigate = useNavigate();
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
  }) => {
    if (!imageFile || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const imageUrl = await uploadImage(imageFile);

      await createCoupon({
        imageUrl,
        menuName,
        discountNum,
        discountType,
      });

      navigate("/mypage");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CouponFormPage
      title="쿠폰 등록하기"
      submitLabel="등록하기"
      requireImage
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit}
    />
  );
};

export default CouponRegistration;
