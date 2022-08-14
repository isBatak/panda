import * as swc from '@swc/core'
import { CallVisitor } from './visitor'
import { createDebugger } from '@css-panda/logger'
import { Collector } from './types'

const moduleName = '.panda/css'

export function cssPlugin(data: Set<any>) {
  return function (program: swc.Program) {
    const visitor = new CallVisitor({
      import: { name: 'css', module: moduleName },
      onData(result) {
        createDebugger('plugin:css')(result)
        data.add(result)
      },
    })
    return visitor.visitProgram(program)
  }
}

export function globalStylePlugin(data: Set<any>) {
  return function (program: swc.Program) {
    const visitor = new CallVisitor({
      import: { name: 'globalStyle', module: moduleName },
      onData(result) {
        createDebugger('plugin:global-style')(result)
        data.add(result)
      },
    })
    return visitor.visitProgram(program)
  }
}

export function fontFacePlugin(data: Set<any>) {
  return function (program: swc.Program) {
    const visitor = new CallVisitor({
      import: { name: 'fontFace', module: moduleName },
      onData(result) {
        createDebugger('plugin:font-face')(result)
        data.add(result)
      },
    })
    return visitor.visitProgram(program)
  }
}

export function createCollector() {
  return {
    css: new Set<any>(),
    globalStyle: new Set<any>(),
    fontFace: new Set<any>(),
  }
}

export function createPlugins(data: Collector) {
  return [cssPlugin(data.css), fontFacePlugin(data.fontFace), globalStylePlugin(data.globalStyle)]
}