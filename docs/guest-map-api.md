# 일반 사용자 동네지도 API 연결

2026-11-02 기준 [배포 서버 Swagger](https://spring.allligo-agent.cloud/swagger-ui/index.html)와 비로그인 실제 응답을 확인해 연결했습니다.

## 사용 API

| 기능 | GET 경로 | 응답 |
| --- | --- | --- |
| 전체 매장 목록 | `/api/v1/stores/public` | `storeId`, `storeName`, `latitude`, `longitude`, `address`, `profileImageUrl`, `couponCount`, `contentCount` 배열 |
| 매장별 공개 콘텐츠 | `/api/v1/contents/public/stores/{storeId}` | `contentId`, `contentType`, `title`, `bodyText`, `caption`, `posterUrl`, `videoUrl` 배열 |
| 매장별 쿠폰 | `/api/v1/coupons/stores/{storeId}` | 기존 쿠폰 목록 배열 |

세 API 모두 소상공인 로그인 토큰 없이 호출합니다. 별도 `VITE_GUEST_STORES_ENDPOINT`, `VITE_GUEST_STORE_CONTENTS_ENDPOINT` 설정은 더 이상 필요하지 않습니다. 카카오 지도는 기존 `VITE_KAKAO_MAP_KEY`를 사용합니다.

## 지도 탐색

전체 매장 API는 위치 쿼리를 받지 않습니다. 전체 목록을 받은 뒤 프론트엔드에서 지도 검색 중심 반경 3km를 계산해 기존 주변 탐색 동작을 유지합니다. 좌표가 유효하고 쿠폰 또는 공개 콘텐츠가 하나 이상 있는 매장이 대상입니다. 쿠폰이 없는 콘텐츠 전용 매장도 표시됩니다. `전체`, `쿠폰`, `콘텐츠` 필터와 거리 정렬은 같은 목록에 적용됩니다.

지역을 검색하거나 지도를 움직인 뒤 재검색하면 해당 위치 주변 매장을 표시합니다. 목록은 새로고침, 화면 복귀, 화면이 보이는 동안 60초 간격으로 갱신합니다. 즉시 푸시 방식은 아닙니다. 최초 위치는 기존과 동일하게 영남대 주변이며, 위치 권한은 ‘내 위치로 이동’을 눌렀을 때만 요청합니다.

## 콘텐츠 표시

가게를 선택하면 매장 ID로 공개 콘텐츠 목록을 요청합니다. 쿠폰이 없는 매장은 콘텐츠 탭을 먼저 엽니다. 다른 가게로 이동하거나 화면을 닫으면 이전 요청을 취소합니다.

- `POST`: `title`, `bodyText`, `posterUrl`을 표시합니다. 본문은 HTML을 실행하지 않고 텍스트로 표시합니다.
- `VIDEO`: `title`, `caption`, `videoUrl`을 사용합니다. 실제 서버의 YouTube Shorts URL은 YouTube iframe 플레이어로 변환하고 원문 링크도 제공합니다. 직접 재생 가능한 영상 파일 URL은 기본 비디오 플레이어를 사용합니다.
- 콘텐츠 없음과 조회 실패를 구분하고, 실패 시 재시도 버튼을 제공합니다. 예시 콘텐츠를 실제 데이터 대신 넣지 않습니다.

현재 서버 계약은 **PUBLISHED(발행 완료) 콘텐츠만 반환**합니다. 생성 완료라도 아직 발행하지 않았으면 공개 목록과 `contentCount`에 포함되지 않습니다. 생성 직후 공개하려면 서버 정책 변경이 필요합니다. YouTube 영상의 삭제·비공개·외부 재생 제한에 따라 재생 가능 여부가 달라질 수 있으며, 원문 링크는 함께 유지합니다.

## 검증

```sh
node --test tests/guestDiscovery.test.mjs
npm run build
```

테스트 9개, 변경한 소스의 ESLint 검사, 프로덕션 빌드를 통과했습니다. 실제 서버에서 전체 매장 조회, 콘텐츠 전용 매장, 매장별 영상 목록, 콘텐츠 없는 매장의 빈 배열 응답을 확인했습니다. 브라우저에서 콘텐츠 전용 매장 노출, 쿠폰 필터, 매장 선택, 콘텐츠 제목·설명·YouTube 링크, 카페101의 쿠폰 3개와 콘텐츠 7개 표시를 확인했습니다. 영상 재생 자체는 이번 검증에 포함하지 않았습니다.

점검 중 일부 요청에서 HTTP 500 또는 15초 시간 초과가 발생했으며, 이후 재조회에서는 정상 응답했습니다. 기존 오류 안내 및 재조회 동작을 유지합니다.
