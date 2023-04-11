// ecosystem.config.js 配置演示
module.exports = {
  apps: [{
    name: 'demo',      // 应用的名称
    script: 'app.js',   // 应用文件路径
    env: {
      PM2_SERVE_PATH: ".",    // 静态服务的路径
      PM2_SERVE_PORT: 8080,   // 静态服务器访问的端口
      NODE_ENV: 'development' // 设置开发环境运行时
    },
    env_production: {
      NODE_ENV: 'production'  // 设置生产环境运行时
    },
    instances: "max",         // 将应用程序分布在所有CPU核心上 也可以指定多少个
    watch: true,              // 热启动模式
    output: './out.log',      // 指定日志标准输出文件及位置
    error: './error.log',     // 错误输出日志文件及位置
    merge_logs: true,         // 是否可以合并日志
    log_type: "json",         // 日志类型
    log_date_format: "DD-MM-YYYY",  // 日志的日期格式
  }],
  deploy: {
    production: {
      user: 'SSH_USERNAME',
      host: 'SSH_HOSTMACHINE',
      ref: 'origin/master',
      repo: 'GIT_REPOSITORY',
      path: 'DESTINATION_PATH',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
}