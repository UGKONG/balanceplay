// 숫자 포맷 함수
export default function useNumber (value = 0) {
  let result = String(value).replaceAll(',', '').replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return result;
}