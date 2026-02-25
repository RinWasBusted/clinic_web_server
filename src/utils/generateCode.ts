function random6Digits(cre:string): string {
  return cre+ Math.floor(100000 + Math.random() * 900000).toString();
}
export default random6Digits