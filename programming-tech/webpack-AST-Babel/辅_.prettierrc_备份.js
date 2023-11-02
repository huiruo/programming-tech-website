module.exports = {
  tabWidth: 2, // 一个tab代表几个空格数，默认就是2
  useTabs: false, // 启用tab取代空格符缩进，默认为false
  semi: true, // 行尾是否使用分号，默认为true
  singleQuote: true, // 字符串是否使用单引号，默认为false，设true，即单引号
  quoteProps: 'as-needed', // 给对象里的属性名是否要加上引号，默认为as-needed，即根据需要决定，如果不加引号会报错则加，否则不加
  trailingComma: 'es5', // 是否使用尾逗号，有三个可选值"<none|es5|all>"
  jsxSingleQuote: true, // 在jsx里是否使用单引号，true 表示使用单引号
  trailingComma: 'es5', // 每个键值对后面是否一定有尾随逗号，默认es5，保持默认即可
  bracketSpacing: true, // 对象大括号直接是否有空格，默认为true，效果：{ foo: bar }
}