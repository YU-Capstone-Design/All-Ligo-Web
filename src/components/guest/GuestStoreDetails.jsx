import { useEffect, useState } from "react";
import { IoArrowBack, IoOpenOutline, IoImageOutline, IoLocationOutline, IoStorefrontOutline, IoTicketOutline } from "react-icons/io5";
import { getStoreCoupons } from "../../apis/GuestCouponApi";
import { getGuestStoreContents } from "../../apis/GuestStoreApi";
import { formatCouponDiscount, readItems, safeWebUrl, youtubeEmbedUrl } from "../../utils/guestDiscovery";

export const StoreImage = ({ src, className = "" }) => {
  const [failedSource, setFailedSource] = useState(null);
  return <div className={`flex h-[72px] w-[72px] shrink-0 items-center justify-center overflow-hidden rounded-[14px] border border-[#EAF0F6] bg-[#EEF4FC] text-[#9DBCE1] [&>img]:h-full [&>img]:w-full [&>img]:object-cover [&>svg]:h-[29px] [&>svg]:w-[29px] ${className}`}>
    {src && failedSource !== src
      ? <img src={src} alt="" loading="lazy" onError={() => setFailedSource(src)} />
      : <IoStorefrontOutline aria-hidden="true" />}
  </div>;
};

const CouponCard = ({ coupon }) => (
  <article className="relative mb-3 flex items-center gap-3 overflow-hidden rounded-[13px] border border-[#E8EEF6] bg-white py-3.5 pl-3 pr-10 shadow-[0_3px_10px_#23416b04]">
    <StoreImage src={safeWebUrl(coupon.imageUrl)} className="!h-[61px] !w-[61px] !rounded-[9px]" />
    <div className="min-w-0 [&_h3]:mb-1 [&_h3]:mt-[3px] [&_h3]:text-[13px] [&_h3]:font-semibold [&_h3]:[overflow-wrap:anywhere] [&_p]:text-[10px] [&_p]:text-[#2880EB] [&_strong]:text-[22px] [&_strong]:font-extrabold [&_strong]:leading-tight">
      <span className="block text-[10px] font-semibold tracking-[0.1px] text-[#2880EB]">가게 할인 쿠폰</span>
      <h3>{coupon.menuName || "할인 쿠폰"}</h3>
      <p><strong>{formatCouponDiscount(coupon)}</strong><span> 할인</span></p>
    </div>
    <div className="absolute inset-y-0 right-0 flex w-[33px] items-center justify-center border-l border-dashed border-[#DBE7F7] bg-[#F7FAFF] text-[#87B5F0]" aria-hidden="true"><IoTicketOutline /></div>
  </article>
);

const ContentCard = ({ content }) => {
  const [failedImage, setFailedImage] = useState(false);
  const image = safeWebUrl(content.posterUrl || content.imageUrl);
  const video = safeWebUrl(content.videoUrl || content.s3VideoUrl);
  const embed = youtubeEmbedUrl(video);
  const link = safeWebUrl(content.uploadVideoUrl || content.url) || (embed ? video : "");
  const title = content.title || content.promotionTitle || "가게 소식";
  return (
    <article className="mb-4 overflow-hidden rounded-[14px] border border-[#E8EEF6] bg-white [&>img]:max-h-[340px] [&>img]:w-full [&>img]:bg-[#EAF0F7] [&>img]:object-contain [&>video]:max-h-[340px] [&>video]:w-full [&>video]:bg-[#EAF0F7] [&>video]:object-contain">
      {content.contentType === "VIDEO" && video
        ? embed
          ? <iframe
              className="aspect-video min-h-[200px] w-full border-0 bg-black"
              src={embed}
              title={`${title} 영상`}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          : <video controls playsInline preload="none" poster={image || undefined} src={video} aria-label={title} />
        : image && !failedImage
          ? <img src={image} alt={title} loading="lazy" onError={() => setFailedImage(true)} />
          : <div className="grid h-[90px] place-items-center bg-[#EDF4FF] text-[30px] text-[#9ABDE9]"><IoImageOutline /></div>}
      <div className="p-4 [&_h3]:my-1.5 [&_h3]:text-base [&_h3]:font-bold [&_p]:whitespace-pre-wrap [&_p]:text-[13px] [&_p]:leading-[1.85] [&_p]:text-[#6E7B8B] [&_p]:[overflow-wrap:anywhere] [&_a]:mt-[13px] [&_a]:inline-flex [&_a]:items-center [&_a]:gap-[5px] [&_a]:text-xs [&_a]:text-[#2880EB]">
        <span className="block text-[10px] font-semibold tracking-[0.1px] text-[#2880EB]">{content.contentType === "VIDEO" ? "영상" : "가게 이야기"}</span>
        <h3>{title}</h3>
        <p>{content.contentType === "VIDEO" ? content.caption || content.bodyText || "" : content.bodyText || content.caption || ""}</p>
        {link && <a href={link} target="_blank" rel="noopener noreferrer">{embed ? "YouTube에서 보기" : "콘텐츠 원문 보기"} <IoOpenOutline /></a>}
      </div>
    </article>
  );
};

const ResourceState = ({ loading, error, onRetry, children }) => {
  if (loading) return <div className="flex flex-col items-center justify-center gap-3 px-5 py-8 text-center text-[13px] leading-relaxed text-[#8492A3] [&_strong]:text-base [&_strong]:font-semibold [&_strong]:text-[#47576A]" role="status"><span className="inline-block h-[18px] w-[18px] shrink-0 animate-spin rounded-full border-2 border-[#DBEAFF] border-t-[#2880EB] motion-reduce:animate-none" />불러오는 중이에요</div>;
  if (error) return <div className="flex flex-col items-center justify-center gap-3 px-5 py-8 text-center text-[13px] leading-relaxed text-[#8492A3] [&_strong]:text-base [&_strong]:font-semibold [&_strong]:text-[#47576A]" role="alert"><p>{error}</p><button type="button" className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#EAF3FF] px-3 py-2 text-xs font-semibold text-[#2880EB]" onClick={onRetry}>다시 시도</button></div>;
  return children;
};

const GuestStoreDetails = ({ store, initialTab = "coupons", onClose, refreshKey = 0 }) => {
  const [tab, setTab] = useState(initialTab);
  const [couponState, setCouponState] = useState({ loading: true, items: [], error: "" });
  const [contentState, setContentState] = useState({ loading: true, items: [], error: "" });
  const [couponRetry, setCouponRetry] = useState(0);
  const [contentRetry, setContentRetry] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    getStoreCoupons(store.id, { signal: controller.signal }).then((data) => {
      if (!controller.signal.aborted) setCouponState({ loading: false, items: readItems(data), error: "" });
    }).catch(() => {
      if (!controller.signal.aborted) setCouponState({ loading: false, items: [], error: "쿠폰을 불러오지 못했어요." });
    });
    return () => controller.abort();
  }, [store.id, couponRetry, refreshKey]);

  useEffect(() => {
    const controller = new AbortController();
    getGuestStoreContents(store.id, { signal: controller.signal }).then((result) => {
      if (!controller.signal.aborted) setContentState({ items: result, loading: false, error: "" });
    }).catch(() => {
      if (!controller.signal.aborted) setContentState({ items: [], loading: false, error: "콘텐츠를 불러오지 못했어요." });
    });
    return () => controller.abort();
  }, [store.id, contentRetry, refreshKey]);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between px-5 pt-1 [&_button]:flex [&_button]:min-h-9 [&_button]:items-center [&_button]:gap-1.5 [&_button]:text-xs [&_button]:text-[#8290A1]">
        <button type="button" onClick={onClose}><IoArrowBack /> 가게 목록</button>
      </div>
      <div className="flex items-center justify-between gap-4 px-[22px] pb-3.5 pt-[5px] [&>div:first-child]:min-w-0 [&_h2]:mb-2 [&_h2]:mt-1.5 [&_h2]:text-[21px] [&_h2]:font-bold [&_h2]:leading-snug [&_h2]:[overflow-wrap:anywhere] [&_p]:flex [&_p]:items-start [&_p]:gap-1 [&_p]:text-xs [&_p]:leading-normal [&_p]:text-[#8793A2] [&_p>svg]:mt-0.5 [&_p>svg]:shrink-0">
        <div>
          <span className="block text-[10px] font-semibold tracking-[0.1px] text-[#2880EB]">우리 동네 가게</span>
          <h2>{store.name}</h2>
          <p><IoLocationOutline />{store.address || "지도에서 가게 위치를 확인하세요"}</p>
        </div>
        <StoreImage src={store.imageUrl} />
      </div>
      {store.description && <p className="mx-[22px] mb-4 text-[13px] leading-relaxed text-[#7E858C]">{store.description}</p>}
      <a className="mx-[22px] mb-[22px] flex items-center justify-center gap-[7px] rounded-[10px] bg-[#EEF5FF] p-[11px] text-[13px] font-semibold text-[#2880EB]" href={`https://map.kakao.com/link/to/${encodeURIComponent(store.name)},${store.latitude},${store.longitude}`} target="_blank" rel="noopener noreferrer"><IoLocationOutline /> 길찾기 <IoOpenOutline /></a>
      <div className="flex gap-6 border-b border-[#E7ECF2] px-[22px] [&_button]:border-b-2 [&_button]:border-transparent [&_button]:px-1 [&_button]:py-[13px] [&_button]:text-sm [&_button]:font-semibold [&_button]:text-[#8793A2] [&_button_span]:ml-[5px] [&_button_span]:text-xs [&_button[aria-selected=true]]:border-[#2880EB] [&_button[aria-selected=true]]:text-[#2880EB]" role="tablist" aria-label="가게 소식 종류">
        <button id="guest-coupon-tab" role="tab" aria-controls="guest-coupon-panel" aria-selected={tab === "coupons"} onClick={() => setTab("coupons")}>쿠폰 {!couponState.loading && !couponState.error && <span>{couponState.items.length}</span>}</button>
        <button id="guest-content-tab" role="tab" aria-controls="guest-content-panel" aria-selected={tab === "contents"} onClick={() => setTab("contents")}>콘텐츠 {!contentState.loading && !contentState.error && <span>{contentState.items.length}</span>}</button>
      </div>
      {tab === "coupons" ? (
        <div className="min-h-[200px] bg-[#F8FAFF] px-5 pb-[25px] pt-[18px]" role="tabpanel" id="guest-coupon-panel" aria-labelledby="guest-coupon-tab">
          <ResourceState loading={couponState.loading} error={couponState.error} onRetry={() => { setCouponState({ loading: true, items: [], error: "" }); setCouponRetry((value) => value + 1); }}>
            {couponState.items.length ? <><p className="mb-[13px] text-[11px] text-[#8793A2]">가게에서 준비한 혜택을 확인해 보세요.</p>{couponState.items.map((coupon) => <CouponCard key={coupon.couponId} coupon={coupon} />)}</> : <div className="flex flex-col items-center justify-center gap-3 px-5 py-8 text-center text-[13px] leading-relaxed text-[#8492A3] [&_strong]:text-base [&_strong]:font-semibold [&_strong]:text-[#47576A]"><IoTicketOutline size={32} /><strong>아직 등록된 쿠폰이 없어요</strong><p>새로운 혜택이 생기면 여기서 확인할 수 있어요.</p></div>}
          </ResourceState>
        </div>
      ) : (
        <div className="min-h-[200px] bg-[#F8FAFF] px-5 pb-[25px] pt-[18px]" role="tabpanel" id="guest-content-panel" aria-labelledby="guest-content-tab">
          <ResourceState loading={contentState.loading} error={contentState.error} onRetry={() => { setContentState({ loading: true, items: [], error: "" }); setContentRetry((value) => value + 1); }}>
              {contentState.items.length ? contentState.items.map((content) => <ContentCard key={content.contentId} content={content} />)
                : <div className="flex flex-col items-center justify-center gap-3 px-5 py-8 text-center text-[13px] leading-relaxed text-[#8492A3] [&_strong]:text-base [&_strong]:font-semibold [&_strong]:text-[#47576A]"><IoImageOutline size={32} /><strong>아직 공개된 콘텐츠가 없어요</strong><p>가게의 새로운 소식을 기다려 주세요.</p></div>}
          </ResourceState>
        </div>
      )}
    </div>
  );
};

export default GuestStoreDetails;
