const OWNER_SIGNUP_DRAFT_KEY = "ownerSignupDraft";

export const getOwnerSignupDraft = () => {
  try {
    return JSON.parse(sessionStorage.getItem(OWNER_SIGNUP_DRAFT_KEY)) || {};
  } catch {
    return {};
  }
};

export const updateOwnerSignupDraft = (nextDraft) => {
  const currentDraft = getOwnerSignupDraft();
  const mergedDraft = {
    ...currentDraft,
    ...nextDraft,
  };

  sessionStorage.setItem(OWNER_SIGNUP_DRAFT_KEY, JSON.stringify(mergedDraft));
  return mergedDraft;
};

export const clearOwnerSignupDraft = () => {
  sessionStorage.removeItem(OWNER_SIGNUP_DRAFT_KEY);
};
