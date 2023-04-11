
## 首先从login 开始阅读
```
路由：
http://127.0.0.1:3000/ 

根据cookie:
rope-session： Fe26.2*1*d163237294c34d0699cc1bf82c70d4d3a0c9ae906bcf2e82113d3af72f933d54*1r5OLbXciIXmOi

主页：
http://127.0.0.1:3000/dashboard 
```


## 2.登陆逻辑

session

src\common\session.ts
```js
import type { IronSessionOptions } from 'iron-session'

export const sessionOptions: IronSessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD as string,
  cookieName: 'rope-session',
  cookieOptions: {
    // secure: process.env.NODE_ENV === 'production',
    secure: false,
  },
} 
```
## 2-1.登陆页
src\pages\index.tsx 
```js
export default function PageHome() {
  return (
    <Box toCenter column h-100vh>
      <Box mb-40 text8XL fontBlack>
        <Box>
          <Box inlineFlex bgGradientX={['yellow500', 'red500']} bgClipText transparent>
            Robot
          </Box>
        </Box>
        <Box gray800 bgGradientX={['red500', 'purple500']} bgClipText transparent>
          To Trading Crypto
        </Box>
        <SignButtons />
      </Box>
    </Box>
  )
} 
```

## 登陆调用
src\pages\api\login.ts 
```
export default withIronSessionApiRoute(async function loginRoute(req, res) {
  const { email, password } = req.body
  try {
    const data: any = await query(LOGIN_BY_EMAIL, { input: { email, password } })
    console.log("登陆成功:",data)

    const payload = data.loginByEmail

    // get user from database then:
    req.session.payload = payload

    await req.session.save()

    res.json(payload)
  } catch (error) {
    console.log('error:', error)

    res.status(500).json(error)
  }
}, sessionOptions)
```

## LoginForm
src\modals\ModalSign\LoginForm.tsx
```js
import { Box } from '@fower/react'
import { Form, useForm } from 'fomir-react'
import { useUser } from '@stores/user.store'
import { useToken } from '@stores/token.store'
import { toast } from '@bone-ui/toast'
import { modalService } from '@generated/modalService'
import { useSignStatus } from '@stores/sign-status.store'
import { toDashboard } from '@common/utils'
import { request } from '@common/request'

interface Values {
  email: string
  password: string
}

export function LoginForm() {
  const { setUser } = useUser()
  const { setToken } = useToken()
  const { setStatus } = useSignStatus()
  const form = useForm<Values>({
    onSubmit: async (values) => {
      try {
        const { user, token } = await request('/api/login', {
          method: 'POST',
          body: values,
        })

        setToken(token)
        setUser(user)

        toDashboard()
        modalService.closeModalSign()
      } catch (error: any) {
        console.log('error:', error)
        toast.error(error.message)
      }
    },
    children: [
      {
        name: 'email',
        value: 'rope@qq.com',
        component: 'Input',
        componentProps: {
          placeholder: 'Email',
          size: 'lg',
        },
        validators: {
          required: '请输入邮箱',
        },
      },
      {
        name: 'password',
        value: '123456',
        component: 'Input',
        componentProps: {
          placeholder: 'Password',
          type: 'password',
          size: 'lg',
        },
        validators: {
          required: '请输入密码',
        },
      },
      {
        component: 'Submit',
        text: '登 录',
        componentProps: {
          w: '100%',
        },
      },
    ],
  })

  return (
    <Box>
      <Box as="h1" mb4>
        登录
      </Box>
      <Form form={form}></Form>

      {/* <ThirdPartyLogin></ThirdPartyLogin> */}

      <Box toCenter my4 spaceX2>
        <Box>No account?</Box>
        <Box
          as="a"
          onClick={() => {
            setStatus('register')
          }}
        >
          Create one
        </Box>
      </Box>
    </Box>
  )
}
```

## 从LoginForm可以看到登陆的接口调用
```js
onSubmit: async (values) => {
	try {
		const { user, token } = await request('/api/login', {
			method: 'POST',
			body: values,
		})

		setToken(token)
		setUser(user)

		toDashboard()
		modalService.closeModalSign()
	} catch (error: any) {
		console.log('error:', error)
		toast.error(error.message)
	}
}, 
```
