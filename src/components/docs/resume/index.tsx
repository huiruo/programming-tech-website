import React, { useState } from 'react';
import { ImageViewer } from '../../modal/imageViewer';
import '../../../css/resume.css';

interface Img {
  original: string
}

const designImgs: Img[] = [
  { original: '/img/design01.png' },
  { original: '/img/design02.png' },
  { original: '/img/design03.png' },
]

const tpImgs: Img[] = [
  { original: '/img/tp01.jpg' },
  { original: '/img/tp02.jpg' },
  { original: '/img/tp03.jpg' },
  { original: '/img/tp04.jpg' },
  { original: '/img/tp05.jpg' },
]

const skills: string[] = [
  '熟悉JavaScript,熟悉nodejs,熟悉TypeScirpt,可以编写第三方包的tsd文件',
  '熟悉React,Vue,理解Vue和React框架原理',
  '熟悉nextjs',
  '熟悉 NestJS,并且有使用 NestJS,Prisma 和 Socket.IO 开发即时通讯(IM)应用的工作经验。',
  '熟悉私有组件库的搭建和部署，能从0到1基于verdaccio构建的内部公共组件',
  '具备一定的JS架构能力,能从0到1设计并开发出符合标准的系统架构，如:monorepo(turbo)架构，知道该架构的应用场景、部署标准等',
  '熟悉使用前端包管理工具npm、yarn、pnpm等熟悉webpack、yarn等的配置，懂得如何快速的解决使用和编译中出现的异常',
  '熟悉小程序开发,熟悉uni-app，掌握android开发',
  '熟悉浏览器插件开发，熟悉Electron桌面开发',
  '掌握Spring Boot，golang',
  '掌握Web3前端开发，具备基本的Solidity语言开发能力,能够编写和部署简单的智能合约。'
]

export const Resume = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [preViewImgs, setPreViewImgs] = useState<Img[]>([])

  const openModal = (visible: boolean) => {
    setModalOpen(visible);
  };

  const onPreview = (type: number) => {
    if (type === 1) {
      setPreViewImgs(tpImgs)
    } else if (type === 2) {
      setPreViewImgs(designImgs)
    }
    openModal(true)
  }

  return <div className='resume-container'>
    <div className='skill-title title-font mg2-bottom'>技能：</div>
    {skills.map((item, index) => {
      return (
        <ul key={index}>
          <li>
            {item}
          </li>
        </ul>
      )
    })}

    <div className='skill-title title-font mg2-bottom'>常用框架/技术：</div>
    <ul>
      <li>
        <a target="_blank" href='https://nextjs.org/'>Nextjs</a>
      </li>
      <li>
        <a target="_blank" href='https://nestjs.com/'>Nestjs</a>
      </li>
      <li>
        <a target="_blank" href='https://wagmi.sh/'>Web3: wagmi</a>
      </li>
      <li>
        <a target="_blank" href='https://socket.io'>socket.io</a>
      </li>
      <li>
        <a target="_blank" href='https://nextjs.org/'>React框架:umijs</a>
      </li>
      <li>
        <a target="_blank" href='https://developers.weixin.qq.com/miniprogram/dev/framework/'>微信小程序</a>
      </li>
      <li>
        <a target="_blank" href='https://zh.uniapp.dcloud.io/tutorial/'>基于vue多端开发：uni-app</a>
      </li>
      <li>
        <a target="_blank" href='https://www.plasmo.com/'>chrome插件框架:plasmo</a>
      </li>
      <li>
        <a target="_blank" href='https://create.t3.gg/en/introduction'>基于trpc，Prisma，nextsj全栈框架：t3-app</a>
      </li>
    </ul>

    <div className='skill-title title-font mg2-bottom'>参与项目：</div>

    <ul>
      <li className='mg1-bottom'>
        阿语社交应用
        <div>
          介绍:&nbsp;阿语社交应用。
        </div>
        体验:&nbsp;<div>
          <a target="_blank" href='https://sada.mobi/'>
            Sada
          </a>

          <br/>

          <a target="_blank" href='https://domi.chat/'>
            Domi chat
          </a>
        </div>
      </li>

      <li className='mg1-bottom'>
        泰山啤酒小程序
        <div>
          介绍:&nbsp;千万用户级应用，日流水百万的啤酒商城。
        </div>
        <div>体验：微信搜索"泰山原浆啤酒"</div>
        <div className='onpreview' onClick={() => onPreview(1)}>演示截图</div>
      </li>

      <li className='mg1-bottom'>
        低代码商城设计器
        <div className='flex'>
          体验:&nbsp;<div>
            <a target="_blank" href='https://dcode-editor.vercel.app/#/'>
              Dcode商城设计器(部署在vercel,访问要梯子🤣)
            </a>
          </div>
        </div>
        <div>
          github:&nbsp;
          <a target="_blank" href='https://github.com/huiruo/dcode-editor'>
            Dcode商城设计器
          </a>
        </div>
      </li>

      <li className='mg1-bottom'>
        低代码建站平台
        <div>
          介绍:&nbsp;“数字妙笔”低代码平台提供了画布编辑，界面下方提供了丰富的图形组件，并支持引用多种开源组件实现丰富的图表及异形控件，只需要一键拖拽到画布区域，即可快速构建实现设计图效果。
          <div className='onpreview' onClick={() => onPreview(2)}>演示截图</div>
        </div>
      </li>

      <li className='mg1-bottom'>
        chrome插件：一键识别网站文章并输出markdown
        <div>
          github:&nbsp;
          <a target="_blank" href='https://github.com/huiruo/web-clipper-extension'>
            web-clipper-extension
          </a>
        </div>
      </li>

      <li className='mg1-bottom'>
        基于Electron+react 企业即时通讯与协作App，主要特性是支持企业私有化部署。
        <div className='flex'>
          体验:&nbsp;<div>
            <a target="_blank" href='https://www.workplus.io/'>
              workplus
            </a>
          </div>
        </div>
      </li>
    </ul>

    <ImageViewer isOpen={isModalOpen} openModal={openModal} imgs={preViewImgs} />
  </div>
}