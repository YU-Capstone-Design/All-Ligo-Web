import api from "./api";

export const OWNER_SIGNUP_REGIONS = [
  "서울",
  "인천",
  "경기",
  "강원",
  "대전",
  "세종",
  "충남",
  "충북",
  "대구",
  "경북",
  "부산",
  "울산",
  "경남",
  "광주",
  "전남",
  "전북",
  "제주",
];

const REGION_ALIASES = {
  서울특별시: "서울",
  인천광역시: "인천",
  경기도: "경기",
  강원도: "강원",
  강원특별자치도: "강원",
  대전광역시: "대전",
  세종특별자치시: "세종",
  충청남도: "충남",
  충청북도: "충북",
  대구광역시: "대구",
  경상북도: "경북",
  부산광역시: "부산",
  울산광역시: "울산",
  경상남도: "경남",
  광주광역시: "광주",
  전라남도: "전남",
  전라북도: "전북",
  전북특별자치도: "전북",
  제주도: "제주",
  제주특별자치도: "제주",
};

export const normalizeOwnerSignupRegion = (region) => {
  const trimmedRegion = region?.trim();

  if (!trimmedRegion) return "";
  if (OWNER_SIGNUP_REGIONS.includes(trimmedRegion)) return trimmedRegion;

  return REGION_ALIASES[trimmedRegion] || "";
};

export const signupOwner = async (signupForm) => {
  const region = normalizeOwnerSignupRegion(signupForm.region);

  if (!region) {
    const error = new Error("허용되지 않은 지역입니다.");
    error.response = {
      data: {
        message: "허용되지 않은 지역입니다.",
      },
    };
    throw error;
  }

  const response = await api.post("/api/v1/auth/signup", {
    ...signupForm,
    region,
  });

  return response.data;
};
