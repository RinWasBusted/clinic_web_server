function random6Digits(): string {
  return "NV"+ Math.floor(100000 + Math.random() * 900000).toString();
}
export default random6Digits