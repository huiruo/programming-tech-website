export function wrapPromise(promise) {
  let result;
  let status = "pending";
  const suspender = promise
    .then((res) => {
      result = res;
      status = "success";
    })
    .catch((err) => {
      result = err;
      status = "error";
    });

  return {
    read() {
      if (status === "pending") {
        throw suspender;
      } else if (status === "error") {
        throw result;
      } else if (status === "success") {
        return result;
      }
    },
  };
}
