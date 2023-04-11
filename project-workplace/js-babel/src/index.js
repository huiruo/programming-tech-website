/*
import babel from '@babel/core'

import * as parser from "@babel/parser";
import traverse from "@babel/traverse";

console.log('test----->', babel)

const code = `function square(n) {
  return n * n;
}`;

const ast = parser.parse(code);

traverse(ast, {
  enter(path) {
    if (path.isIdentifier({ name: "n" })) {
      path.node.name = "x";
    }
  },
});
*/