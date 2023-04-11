export function getUser() {
  return new Promise((res) => {
    setTimeout(() => {
      res({ success: true, message: "请求成功", userName: "领哥" });
    }, 6000);
  });
}
