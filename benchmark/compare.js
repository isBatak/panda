#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

/**
 * Reads options from `package.json`
 */
const getOptions = (pathPrefix = process.cwd()) => {
    const pkg = require(path.join(pathPrefix, 'package.json'))
    return { ...pkg.pandaAnalysis, name: pkg.name }
}

function calculatePercentageChange(current, base) {
    return (((current - base) / base) * 100).toFixed(2)
}

function renderDurationTable(currentAnalysis, baseAnalysis) {
    const extractTimeByFilesCurrent = currentAnalysis.duration.extractTimeByFiles;
    const extractTimeByFilesBase = baseAnalysis.duration.extractTimeByFiles;

    let res = ''
    res += '| File | Extract Time | Change |\n'
    res += '| ---- | ---- | ------ |\n'

    Object.keys(extractTimeByFilesCurrent).forEach((key) => {
        const extractTimeCurrent = extractTimeByFilesCurrent[key];
        const extractTimeBase = extractTimeByFilesBase[key];

        const percentageChange = calculatePercentageChange(extractTimeCurrent, extractTimeBase)

        res += `| ${key.replace(process.cwd(), '')} | ${extractTimeCurrent} | ${renderStatusIndicator(percentageChange)}${percentageChange}% |\n`
    })

    const extractTotalCurrent = currentAnalysis.duration.extractTotal;
    const extractTotalBase = baseAnalysis.duration.extractTotal;

    const percentageChange = calculatePercentageChange(extractTotalCurrent, extractTotalBase)

    res += `| <b>Extract Total</b> | ${extractTotalCurrent} | ${renderStatusIndicator(percentageChange)}${percentageChange}% |\n`

    const classifyCurrent = currentAnalysis.duration.classify;
    const classifyBase = baseAnalysis.duration.classify;

    const percentageChangeClassify = calculatePercentageChange(classifyCurrent, classifyBase)

    res += `| <b>Classify</b> | ${classifyCurrent} | ${renderStatusIndicator(percentageChangeClassify)}${percentageChangeClassify}% |\n`

    return res
}

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


// Pull options from `package.json`
const options = getOptions()

const BUDGET = options.budget
const BUDGET_PERCENT_INCREASE_RED = options.budgetPercentIncreaseRed

const reportCurrent = require(path.join(
    process.cwd(),
    'report.json'
))

const reportBase = require(path.join(
    process.cwd(),
    'base-report',
    'bundle',
    'report.json'
))

let output = `## 🤖 Panda CSS analysis report

${renderDurationTable(reportCurrent, reportBase)}

`

output += `\n<details>
<summary>Details</summary>
<p>TODO</p>
</details>\n`

output += `<!-- __PANDA_CSS_ANALISYS__ -->`

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