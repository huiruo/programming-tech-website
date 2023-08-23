```js
type Urls = {
  uat: string;
  test: string;
  prod: string;
}

const urls: Urls = {
  uat: 'https://x1.com',
  test: 'http://x2.cn/',
  prod: 'http://x3.cn/'
}

function generateUrl(environment: keyof Urls): string {
  return urls[environment]
}

const instance = axios.create({
  baseURL: generateUrl(process.env.UMI_ENV as keyof Urls),
})
```