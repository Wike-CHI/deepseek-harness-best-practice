// weather-orchestrator — DSH workflow 移植版
//
// 上游原型：claude-code-best-practice 的 Command → Agent → Skill 编排链
//   /weather-orchestrator (command) → weather-agent (subagent) → weather-fetcher + weather-svg-creator (skills)
//
// DSH 范式升级：markdown「执行契约（non-negotiable）」依赖模型自觉；
// workflow 是代码级编排——阶段顺序、参数传递、失败中止都由脚本保证，不依赖 prompt 约束。
//
// 用法（在 DSH 会话中对 agent 说）：「用 workflow 跑 examples/weather-orchestrator/weather-orchestrator.workflow.js，城市 Dubai」
// 或直接把本文件内容作为 workflow 工具的 script 参数传入，args 例如 { "city": "Dubai", "unit": "C" }

const city = (args && args.city) || 'Dubai'
const unit = (args && args.unit) || 'C'

// ── 阶段 1：获取天气（对应 weather-agent + weather-fetcher skill）─────────────
phase('获取天气')
log('查询 ' + city + ' 当前气温（单位: °' + unit + '）')

const weather = await agent(
  '查询 ' + city + ' 的当前天气（可用 web_search，近似值即可）。' +
  '返回温度数值、单位（°' + unit + '，如需则换算）和天气状况的简短中文描述。',
  {
    label: 'weather-fetcher',
    schema: {
      type: 'object',
      properties: {
        temp: { type: 'number' },
        unit: { type: 'string' },
        condition: { type: 'string' },
      },
      required: ['temp', 'unit', 'condition'],
      additionalProperties: false,
    },
  },
)

// 原命令的 fail-closed guardrail——在这里是真实代码，不是对模型的恳求
if (!weather || typeof weather.temp !== 'number') {
  throw new Error('天气获取失败，中止编排（不生成卡片）')
}
log('获取成功: ' + weather.temp + '°' + weather.unit + '，' + weather.condition)

// ── 阶段 2：生成 SVG 卡片（对应 weather-svg-creator skill）───────────────────
phase('生成卡片')

const render = await agent(
  '根据以下天气数据生成一张美观的 SVG 天气卡片（深色背景圆角卡片，大字温度、城市名、天气状况），' +
  '写入 examples/weather-orchestrator/weather.svg；' +
  '再写一份 examples/weather-orchestrator/output.md 作为总结（含温度、单位、状况、生成时间）。\n\n' +
  '天气数据：' + JSON.stringify({ city: city, temp: weather.temp, unit: weather.unit, condition: weather.condition }),
  { label: 'weather-svg-creator' },
)

return {
  city: city,
  weather: weather,
  render: render ? String(render).slice(0, 300) : null,
  outputs: ['examples/weather-orchestrator/weather.svg', 'examples/weather-orchestrator/output.md'],
}
