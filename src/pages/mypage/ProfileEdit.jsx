import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import arrowup from "../../assets/arrow-up.svg";
import AuthButton from "../../components/auth/AuthButton";
import {
  getMyPageInfo,
  getProfileImagePresignedUrl,
  updateMyProfile,
  updateMyProfileImage,
  uploadProfileImageToS3,
} from "../../apis/UserApi";
import loadKakaoMap from "../../utils/loadKakaoMap";

import { LuPencil } from "react-icons/lu";
import { GrLocation } from "react-icons/gr";
import { FiLink } from "react-icons/fi";

const getSavedStoreLocation = () =>
  localStorage.getItem("mypageStoreLocation") || "";

const getAddressFromCoords = async (latitude, longitude) => {
  const kakao = await loadKakaoMap();

  return new Promise((resolve) => {
    const geocoder = new kakao.maps.services.Geocoder();

    geocoder.coord2Address(longitude, latitude, (result, status) => {
      if (status !== kakao.maps.services.Status.OK || !result.length) {
        resolve("");
        return;
      }

      resolve(
        result[0].road_address?.address_name ||
          result[0].address?.address_name ||
          ""
      );
    });
  });
};

const ProfileEdit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);

  const [profileImage, setProfileImage] = useState(null);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [storeName, setStoreName] = useState("");
  const [storeLink, setStoreLink] = useState("");
  const [storeLocation, setStoreLocation] = useState(getSavedStoreLocation);
  const [detailAddress, setDetailAddress] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [isLinkInvalid, setIsLinkInvalid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadMyPageInfo = async () => {
      try {
        const myPageInfo = await getMyPageInfo();

        if (!isMounted) return;

        setProfileImage(myPageInfo.profileImageUrl || null);
        setStoreName(myPageInfo.storeName || "");
        setStoreLink(myPageInfo.mapUrl || "");
        setLatitude(myPageInfo.latitude ?? null);
        setLongitude(myPageInfo.longitude ?? null);

        const savedLocation = getSavedStoreLocation();
        if (savedLocation) {
          setStoreLocation(savedLocation);
          return;
        }

        if (myPageInfo.latitude && myPageInfo.longitude) {
          const address = await getAddressFromCoords(
            myPageInfo.latitude,
            myPageInfo.longitude
          );

          if (!isMounted || !address) return;

          localStorage.setItem("mypageStoreLocation", address);
          setStoreLocation(address);
        }
      } catch (error) {
        if (isMounted) {
          setFormError(
            error.response?.data?.message ||
              "마이페이지 정보를 불러오지 못했어요."
          );
        }
      }
    };

    loadMyPageInfo();

    const savedForm = sessionStorage.getItem("profileEditFormTemp");
    if (savedForm) {
      const parsed = JSON.parse(savedForm);
      if (parsed.profileImage) setProfileImage(parsed.profileImage);
      if (parsed.latitude) setLatitude(parsed.latitude);
      if (parsed.longitude) setLongitude(parsed.longitude);
      if (parsed.storeName) setStoreName(parsed.storeName);
      if (parsed.storeLink) setStoreLink(parsed.storeLink);
      if (parsed.storeLocation) setStoreLocation(parsed.storeLocation);
      if (parsed.detailAddress) setDetailAddress(parsed.detailAddress);
      sessionStorage.removeItem("profileEditFormTemp");
    }

    if (location.state?.selectedLocation) {
      setStoreLocation(location.state.selectedLocation);
      sessionStorage.removeItem("returningFromMap");
      return;
    }

    const isReturningFromMap = sessionStorage.getItem("returningFromMap");
    if (isReturningFromMap === "true") {
      const savedLocation = localStorage.getItem("mypageStoreLocation");
      const savedLatitude = localStorage.getItem("mypageStoreLatitude");
      const savedLongitude = localStorage.getItem("mypageStoreLongitude");
      if (savedLocation) {
        setStoreLocation(savedLocation);
      }
      if (savedLatitude) setLatitude(Number(savedLatitude));
      if (savedLongitude) setLongitude(Number(savedLongitude));
      sessionStorage.removeItem("returningFromMap");
    }

    return () => {
      isMounted = false;
    };
  }, [location]);

  const handleLocationClick = () => {
    const currentForm = {
      profileImage,
      latitude,
      longitude,
      storeName,
      storeLink,
      storeLocation,
      detailAddress,
    };
    sessionStorage.setItem("profileEditFormTemp", JSON.stringify(currentForm));
    sessionStorage.setItem("returningFromMap", "true");
    navigate("/mypage/location");
  };

  const checkLinkValid = (value) => {
    const trimmed = value.trim();

    if (/^www\./i.test(trimmed)) {
      const dotCount = (trimmed.match(/\./g) || []).length;
      if (dotCount < 2) return false;
    }

    const linkRegex = /^(https?:\/\/)?([\w-]+\.)+[a-zA-Z]{1,}(\/.*)?$/;
    return linkRegex.test(trimmed);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImageFile(file);
      setProfileImage(imageUrl);
      setFormError("");
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const uploadProfileImage = async (imageFile) => {
    const contentType = imageFile.type || "image/jpeg";
    const presignedResponse = await getProfileImagePresignedUrl({
      fileName: imageFile.name,
      contentType,
    });

    await uploadProfileImageToS3({
      presignedUrl: presignedResponse.presignedUrl,
      file: imageFile,
      contentType,
    });

    return presignedResponse.fileUrl;
  };

  const handleSubmit = async () => {
    const isValid = checkLinkValid(storeLink);
    setIsLinkInvalid(!isValid);

    if (!isValid || isSubmitting) {
      return;
    }

    if (latitude === null || longitude === null) {
      setFormError("가게 위치를 선택해주세요.");
      return;
    }

    try {
      setIsSubmitting(true);
      setFormError("");

      await updateMyProfile({
        storeName: storeName.trim(),
        mapUrl: storeLink.trim(),
        latitude,
        longitude,
      });

      if (profileImageFile) {
        const profileImageUrl = await uploadProfileImage(profileImageFile);
        await updateMyProfileImage(profileImageUrl);
      }

      localStorage.setItem("mypageStoreLocation", storeLocation);
      localStorage.setItem("mypageStoreLatitude", String(latitude));
      localStorage.setItem("mypageStoreLongitude", String(longitude));
      navigate("/mypage");
    } catch (error) {
      setFormError(
        error.response?.data?.message ||
          "프로필 정보를 수정하지 못했어요. 입력 정보를 확인해주세요."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-white flex flex-col">
      <header className="flex items-center py-[11px]">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="pl-[16px]"
        >
          <img src={arrowup} alt="뒤로가기" />
        </button>
        <div className="w-[314px] text-center text-[16px] leading-[20px]">
          프로필 수정
        </div>
      </header>

      <section className="px-[16px] pt-[28px]">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageChange}
          accept="image/*"
          className="hidden"
        />

        <button
          type="button"
          onClick={handleImageClick}
          className="relative mx-auto block h-[116px] w-[116px] rounded-full overflow-visible focus:outline-none"
        >
          <div
            className={`h-full w-full rounded-full overflow-hidden bg-cover bg-center ${
              !profileImage
                ? "bg-[radial-gradient(circle_at_42%_34%,#f7c25a_0_14%,#3269a7_15%_34%,#d64536_35%_47%,#11325d_48%_100%)]"
                : ""
            }`}
            style={
              profileImage ? { backgroundImage: `url(${profileImage})` } : {}
            }
          />
          <span className="absolute bottom-[2px] right-[2px] flex h-[28px] w-[28px] items-center justify-center rounded-full bg-[#D9E0E6] text-[14px] shadow-sm">
            <LuPencil className="h-[16px] w-[16px] text-[#424950] stroke-[2.5]" />
          </span>
        </button>

        <div className="mt-[46px] space-y-[24px]">
          <label className="block">
            <span className="text-[14px] font-medium text-[#424950]">
              가게 이름
            </span>
            <input
              value={storeName}
              onChange={(event) => {
                setStoreName(event.target.value);
                setFormError("");
              }}
              placeholder="가게 이름을 입력해주세요"
              className="mt-[10px] h-[56px] w-full rounded-[10px] bg-[#F7F8FA] px-[16px] text-[16px] text-[#020913] font-medium outline-none placeholder:text-[#C1C7CE]"
            />
          </label>

          <label className="block">
            <span className="text-[14px] font-medium text-[#424950]">
              가게 링크
            </span>
            <div className="mt-[10px] flex h-[56px] items-center gap-[10px] rounded-[10px] bg-[#F7F8FA] px-[16px]">
              <span className="text-[22px]">
                <FiLink />
              </span>
              <input
                value={storeLink}
                placeholder="가게 링크를 입력해주세요"
                onChange={(event) => {
                  setStoreLink(event.target.value);
                  setIsLinkInvalid(false);
                  setFormError("");
                }}
                className="min-w-0 flex-1 bg-transparent text-[16px] text-[#020913] font-medium outline-none placeholder:text-[#C1C7CE]"
              />
            </div>
            {isLinkInvalid && (
              <p className="mt-[8px] text-[14px] font-normal text-[#DF0024]">
                링크가 유효하지 않습니다.
              </p>
            )}
          </label>

          <button
            type="button"
            onClick={handleLocationClick}
            className="block w-full text-left"
          >
            <span className="text-[14px] font-medium text-[#424950]">
              가게 위치
            </span>
            <div className="mt-[10px] flex h-[56px] items-center gap-[10px] rounded-[10px] bg-[#F7F8FA] px-[16px]">
              <GrLocation className="w-[25px] h-[25px] text-[#020913]" />
              <span
                className={`text-[16px] font-medium ${
                  storeLocation ? "text-[#020913]" : "text-[#C1C7CE]"
                }`}
              >
                {storeLocation || "가게 위치를 선택해주세요"}
              </span>
            </div>
          </button>

          <label className="block">
            <input
              value={detailAddress}
              onChange={(event) => setDetailAddress(event.target.value)}
              placeholder="상세주소를 입력해주세요"
              className="h-[56px] w-full rounded-[10px] bg-[#F7F8FA] px-[16px] text-[15px] font-semibold outline-none placeholder:text-[#C1C7CE]"
            />
          </label>
          {formError && (
            <p className="text-[14px] font-normal text-[#DF0024]">
              {formError}
            </p>
          )}
        </div>
      </section>

      <div className="mt-auto px-[16px] pb-[calc(54px+env(safe-area-inset-bottom))]">
        <AuthButton isActive={!isSubmitting} onClick={handleSubmit}>
          {isSubmitting ? "수정 중" : "수정하기"}
        </AuthButton>
      </div>
    </div>
  );
};

export default ProfileEdit;
