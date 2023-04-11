## tie
```text
https://github.com/forsigner/tie 
https://tiejs.vercel.app/

npm i -g tie-cli
tie create myapp # 选择 minimal-controller
cd myapp
npm run dev
```

## controller
```js
import { Controller, Post, Body } from '@tiejs/controller'
import { Log } from './log.entity'
import { LogService } from './log.service'

@Controller()
export class LogController {
  constructor(private logService: LogService) {}

  @Post('/api/logs')
  async addLog(@Body() body: any): Promise<Log> {
    return await this.logService.addLog(body)
  }
}
```

## 提供者 (Provider) 是用来组织代码的最小单位
```text
服务是业务逻辑的抽象，通常你会在 Controller 或 Resolver 中通过依赖注入的方式调用 Service，TieJS 使用 依赖注入 的方式组织代码，这是非常重要特性，因为它使代码有更好的可读性，也更易于进行单元测试。
```


通常你会在 Controller 或 Resolver 中通过依赖注入的方式调用 Service:

module\auth\auth.resolver.ts
```js
import { User } from '@module/user/user.entity'
import { Injectable } from '@tiejs/common'
import { Transactional } from '@tiejs/typeorm'
import { Arg, Mutation, Resolver } from 'type-graphql'
import { LoginByEmailInput, RegisterByEmailInput } from './auth.input'
import { AuthService } from './auth.service'
import { LoginSuccessPayload } from './auth.type'

@Injectable()
@Resolver(() => User)
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => LoginSuccessPayload, { description: '邮箱注册' })
  @Transactional()
  async registerByEmail(@Arg('input') input: RegisterByEmailInput): Promise<LoginSuccessPayload> {
    return await this.authService.registerByEmail(input)
  }

  @Mutation(() => LoginSuccessPayload, { description: '邮箱登录' })
  @Transactional()
  async loginByEmail(@Arg('input') input: LoginByEmailInput): Promise<LoginSuccessPayload> {
    return await this.authService.loginByEmail(input)
  }
}
```

## graphql
```
https://tiejs.vercel.app/docs/basic/graphql
```
简单的hello world 项目结构如下:
```
.
├── hello.resolver.ts
├── package.json
└── tsconfig.json
```

## 在 TieJS 中，xxx.resolver.ts 是 GraphQL 的端点文件，类似 MVC 架构中的 Controller。
```js
import { Resolver, Query } from 'type-graphql'
import { Injectable } from '@tiejs/common'

@Injectable()
@Resolver(() => String)
export class HelloResolver {
  @Query(() => String)
  async hello() {
    return 'hello world'
  }
}
```

### 再举个resolver例子：
module\auth\auth.resolver.ts
```js
import { User } from '@module/user/user.entity'
import { Injectable } from '@tiejs/common'
import { Transactional } from '@tiejs/typeorm'
import { Arg, Mutation, Resolver } from 'type-graphql'
import { LoginByEmailInput, RegisterByEmailInput } from './auth.input'
import { AuthService } from './auth.service'
import { LoginSuccessPayload } from './auth.type'

@Injectable()
@Resolver(() => User)
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => LoginSuccessPayload, { description: '邮箱注册' })
  @Transactional()
  async registerByEmail(@Arg('input') input: RegisterByEmailInput): Promise<LoginSuccessPayload> {
    return await this.authService.registerByEmail(input)
  }

  @Mutation(() => LoginSuccessPayload, { description: '邮箱登录' })
  @Transactional()
  async loginByEmail(@Arg('input') input: LoginByEmailInput): Promise<LoginSuccessPayload> {
    return await this.authService.loginByEmail(input)
  }
}
```

