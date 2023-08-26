#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

/**
 * Reads options from `package.json`
 */
const getOptions = (pathPrefix = process.cwd()) => {
    const pkg = require(path.join(pathPrefix, 'package.json'))
    return { ...pkg.nextBundleAnalysis, name: pkg.name }
}

// Pull options from `package.json`
const options = getOptions()

const BUDGET_PERCENT_INCREASE_RED = options.budgetPercentIncreaseRed

const currentBundle = require(path.join(
    process.cwd(),
    'report.json'
))

const baseBundle = require(path.join(
    process.cwd(),
    'base-report/report.json'
))

let output = `## 🤖 Panda CSS Benchmark

`

output += `<!-- __PANDA_CSS_BENCHMARK__ -->`

// log the output, mostly for testing and debugging. this will show up in the
// github actions console.
console.log(output)

// and to cap it off, we write the output to a file which is later read in as comment
// contents by the actions workflow.
fs.writeFileSync(
    path.join(
      process.cwd(),
      'report_comment.txt'
    ),
    output.trim()
  )

// given a percentage that a metric has changed, renders a colored status indicator
// this makes it easier to call attention to things that need attention
//
// in general:
// - yellow means "keep an eye on this"
// - red means "this is a problem"
// - green means "this is a win"
function renderStatusIndicator(percentageChange) {
  let res = ''
  if (percentageChange > 0 && percentageChange < BUDGET_PERCENT_INCREASE_RED) {
    res += '🟡 +'
  } else if (percentageChange >= BUDGET_PERCENT_INCREASE_RED) {
    res += '🔴 +'
  } else if (percentageChange < 0.01 && percentageChange > -0.01) {
    res += ''
  } else {
    res += '🟢 '
  }
  return res
}