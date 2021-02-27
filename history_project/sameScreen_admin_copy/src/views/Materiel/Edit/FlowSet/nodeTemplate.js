/*
节点模板
* */
import { getSelUUID, getOptUUID } from '../glTool'
// 自定义部分节点类型
export const nodeType = {
  1: {
    sameScreenLocation: 'start',
    sameScreenType: 'flow',
  },
  2: {
    sameScreenType: 'flow',
  },
  3: {
    sameScreenLocation: 'end',
    sameScreenType: 'flow',
  },
}

// 待机节点
export const StandbyNode = [
  {
    id: 'opt_74ef7ba3-d298-484c-8ad3-82d32ab558bd',
    name: '待机节点',
    interfaceCode: '',
    kbId: '',
    sms: '',
    intelligenceMatch: 0,
    intention: '',
    imgUrl: '',
    tag: null,
    operations: [
      {
        sayOptions: {
          ttsEngine: '',
          asrGrammar: '',
          ttsVoice: '',
          interrupt: '',
          asrEngine: '',
          intelligenceInputTimeout: 20000,
        },
        type: 'say',
        sayProperties: [
          {
            description: '待机',
            type: 'text',
            content: '待机',
          },
        ],
        srcProperties: [
          {
            description: '待机',
            type: 'text',
            content: '待机',
          },
        ],
      },
    ],
    selections: [
      {
        id: 'sel_1de6d3a5-5248-4301-ad6b-6b13ca3bfa29',
        name: '默认回答',
        type: 'default',
        rule: '',
        count: null,
        tag: null,
        labels: [],
        ruleCheckFlag: null,
      },
      {
        id: 'sel_49530f87-8795-47d7-8598-9462f3ab2115',
        name: '多轮交互',
        type: 'count',
        rule: null,
        count: '120',
        tag: null,
        labels: [],
        ruleCheckFlag: null,
      },
      {
        id: 'sel_4d6f9945-232b-43e8-bd2e-08ffbea0042d',
        name: '转话术组',
        type: 'flow',
        rule: null,
        count: null,
        tag: null,
        labels: [],
        ruleCheckFlag: null,
      },
    ],
    mediaFragments: [
      {
        internal: [
          {
            name: 'video',
            type: 'video',
            value: '',
            desc: '',
          },
          {
            name: 'standbyVideo',
            type: 'standbyVideo',
            value: '',
            desc: null,
          },
        ],
        extension: null,
      },
    ],
    nodePayload: {
      sameScreenStandby: 'standby',
    },
    interrupt: null,
  },
  {
    id: 'opt_269be9a2-3a1d-4bbf-9920-ab7d5cc2762d',
    name: '提示是否继续',
    interfaceCode: '',
    kbId: '',
    sms: '',
    intelligenceMatch: 0,
    intention: '',
    imgUrl: '',
    tag: null,
    operations: [
      {
        sayOptions: {
          ttsEngine: '',
          asrGrammar: '',
          ttsVoice: '',
          interrupt: '',
          asrEngine: '',
          intelligenceInputTimeout: 20000,
        },
        type: 'say',
        sayProperties: [
          {
            description: '您好，请问还在吗',
            type: 'text',
            content: '您好，请问还在吗',
          },
        ],
        srcProperties: [
          {
            description: '您好，请问还在吗',
            type: 'text',
            content: '您好，请问还在吗',
          },
        ],
      },
    ],
    selections: [
      {
        id: 'sel_b634cd03-f93a-4cf9-80b3-6ada2cdf3cce',
        name: '默认回答',
        type: 'default',
        rule: '',
        count: null,
        tag: null,
        labels: [],
        ruleCheckFlag: null,
      },
    ],
    mediaFragments: [
      {
        internal: [
          {
            name: 'video',
            type: 'video',
            value: '',
            desc: '',
          },
        ],
        extension: null,
      },
    ],
    nodePayload: null,
    interrupt: 0,
  },
  {
    id: 'opt_3a29def3-3562-4da0-b1a9-99de7bd0c07f',
    name: '挂断',
    interfaceCode: null,
    kbId: null,
    sms: null,
    intelligenceMatch: null,
    intention: null,
    imgUrl: null,
    tag: null,
    operations: [
      {
        sayOptions: null,
        type: 'hangup',
        sayProperties: null,
        srcProperties: null,
      },
    ],
    selections: [],
    mediaFragments: [
      {
        internal: [],
        extension: [],
      },
    ],
    nodePayload: null,
    interrupt: null,
  },
]
// 待机节点树
export const StandbyNodeTree = {
  id: 'opt_74ef7ba3-d298-484c-8ad3-82d32ab558bd',
  name: '待机节点',
  fold: false,
  fromId: 'opt_f0ebc8e1-32a4-4c93-af8e-376ec6df6709',
  fromSelectId: 'sel_2edd3138-028a-4899-a6e0-ac3abb85844f',
  nextRelations: [
    {
      id: 'sel_1de6d3a5-5248-4301-ad6b-6b13ca3bfa29',
      name: '默认回答',
      fold: false,
      type: 'default',
      next: {
        jump: true,
        id: '',
        flowId: null,
        jumpMode: 'flow',
        retPosition: null,
        retSelection: null,
      },
    },
    {
      id: 'sel_49530f87-8795-47d7-8598-9462f3ab2115',
      name: '多轮交互',
      fold: false,
      type: 'count',
      next: {
        id: 'opt_269be9a2-3a1d-4bbf-9920-ab7d5cc2762d',
        name: '提示是否继续',
        fold: false,
        fromId: 'opt_74ef7ba3-d298-484c-8ad3-82d32ab558bd',
        fromSelectId: 'sel_49530f87-8795-47d7-8598-9462f3ab2115',
        nextRelations: [
          {
            id: 'sel_b634cd03-f93a-4cf9-80b3-6ada2cdf3cce',
            name: '默认回答',
            fold: false,
            type: 'default',
            next: {
              id: 'opt_3a29def3-3562-4da0-b1a9-99de7bd0c07f',
              name: '挂断',
              fold: false,
              fromId: 'opt_269be9a2-3a1d-4bbf-9920-ab7d5cc2762d',
              fromSelectId: 'sel_b634cd03-f93a-4cf9-80b3-6ada2cdf3cce',
              nextRelations: [],
            },
          },
        ],
      },
    },
    {
      id: 'sel_4d6f9945-232b-43e8-bd2e-08ffbea0042d',
      name: '转话术组',
      fold: false,
      type: 'flow',
      next: {
        jump: true,
        id: '',
        flowId: '',
        jumpMode: 'flow',
        retPosition: null,
        retSelection: null,
      },
    },
  ],
}
// 常规节点生成
export function routineNode(
  opt_one = null, // 第一个流程节点id，这个id必定和页面上的列表id一致
  flowId = null,
  name = null,
  imgUrl = { name: null, desc: null },
  video = { url: null, desc: null },
  audio = { url: null, desc: null },
  nextName = null,
  type = 2, // 1 开始节点，2中间节点，3最后一个节点
) {
  // const opt_one = getOptUUID()
  const sel_one = getSelUUID()
  const opt_two = getOptUUID()
  const sel_two = getSelUUID()
  const sel_three = getSelUUID()
  // 常规节点模板
  const node = [
    {
      id: opt_one,
      name: name,
      interfaceCode: '',
      kbId: '',
      sms: '',
      intelligenceMatch: 0,
      intention: '',
      imgUrl: imgUrl.name,
      tag: null,
      operations: [
        {
          sayOptions: {
            ttsEngine: '',
            asrGrammar: '',
            ttsVoice: '',
            interrupt: '',
            asrEngine: '',
            intelligenceInputTimeout: 20000,
          },
          type: 'say',
          sayProperties: [
            {
              description: '',
              type: 'custom',
              content: '',
            },
            {
              description: audio.desc,
              type: 'text',
              content: audio.desc,
            },
          ],
          srcProperties: [
            {
              description: '',
              type: 'custom',
              content: '',
            },
            {
              description: audio.desc,
              type: 'text',
              content: audio.desc,
            },
          ],
        },
      ],
      selections: [
        {
          id: sel_one,
          name: `进入${name}判断`,
          type: 'default',
          rule: '',
          count: null,
          tag: null,
          labels: [],
          ruleCheckFlag: null,
        },
      ],
      mediaFragments: [
        {
          internal: [
            {
              name: 'text',
              type: 'text',
              value: audio.desc,
              desc: audio.desc,
            },
            {
              name: 'image',
              type: 'image',
              value: imgUrl.name,
              desc: name,
            },
            {
              name: 'longImage',
              type: 'longImage',
              value: imgUrl.name,
              desc: name,
            },
            {
              name: 'audio',
              type: 'audio',
              value: audio.url,
              desc: audio.desc,
            },
            {
              name: 'video',
              type: 'video',
              value: video.url,
              desc: video.desc,
            },
            {
              name: 'eye',
              type: 'eye',
              value: null,
              desc: '眼睛',
            },
            {
              name: 'mouthShape',
              type: 'mouthShape',
              value: null,
              desc: '口型',
            },
            {
              name: 'action',
              type: 'action',
              value: null,
              desc: '动作',
            },
            {
              name: 'bottom',
              type: 'bottom',
              value: null,
              desc: '底图',
            },
          ],
          extension: null,
        },
      ],
      nodePayload: nodeType[type],
      interrupt: null,
    },
    {
      id: opt_two,
      name: name + '判断',
      interfaceCode: '',
      kbId: '',
      sms: '',
      intelligenceMatch: 0,
      intention: '',
      imgUrl: '',
      tag: null,
      operations: [
        {
          sayOptions: null,
          type: 'skip',
          sayProperties: null,
          srcProperties: null,
        },
      ],
      selections: [
        {
          id: sel_two,
          name: '转话术组',
          type: 'flow',
          rule: '',
          count: null,
          tag: null,
          labels: [],
          ruleCheckFlag: null,
        },
        {
          id: sel_three,
          name: '进入' + nextName,
          type: 'default',
          rule: '',
          count: null,
          tag: null,
          labels: [],
          ruleCheckFlag: null,
        },
      ],
      mediaFragments: null,
      nodePayload: null,
      interrupt: null,
    },
  ]
  // 常规节点树
  const nodeTree = {
    id: opt_one,
    name: name,
    fold: false,
    fromId: '',
    fromSelectId: '',
    nextRelations: [
      {
        id: sel_one,
        name: `进入${name}判断`,
        fold: false,
        type: 'default',
        next: {
          id: opt_two,
          name: name + '判断',
          fold: false,
          fromId: opt_one,
          fromSelectId: sel_one,
          nextRelations: [
            {
              id: sel_two,
              name: '转话术组',
              fold: false,
              type: 'flow',
              next: {
                jump: true,
                id: '',
                flowId: flowId,
                jumpMode: 'flow',
                retPosition: null,
                retSelection: null,
              },
            },
            {
              id: sel_three,
              name: '进入' + nextName,
              fold: false,
              type: 'default',
              next: null,
            },
          ],
        },
      },
    ],
  }

  return {
    nodeTree,
    node,
  }
}
