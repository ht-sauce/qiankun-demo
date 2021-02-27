/*
节点模板
* */
export default function() {
  // 所有结构的主节点
  const mainTree = {
    id: 'opt_c69a1bff-5dcc-4133-8b4d-f98c92b05244',
    name: '问答判断',
    fold: false,
    fromId: '',
    fromSelectId: '',
    nextRelations: null,
  }
  const mainNodeContent = {
    id: 'opt_c69a1bff-5dcc-4133-8b4d-f98c92b05244',
    name: '问答判断',
    interfaceCode: '',
    kbId: '',
    sms: '',
    intelligenceMatch: 1,
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
      // 当个模板，知道后续插入怎么插入
      {
        id: 'sel_6115ea1d-c86e-493a-8af0-60bc1aa83afa',
        name: '有什么作用',
        type: 'rule',
        rule: '(冰川水|阿尔卑斯山|作用|有什么用|效果|功效)|(有什么作用)',
        count: null,
        tag: '作用',
        labels: [],
        ruleCheckFlag: null,
      },
    ],
    mediaFragments: null,
    nodePayload: null,
    interrupt: null,
  }
  // 问答节点结构
  const QaNode = {
    id: 'sel_6115ea1d-c86e-493a-8af0-60bc1aa83afa',
    name: '有什么作用',
    fold: false,
    type: 'rule',
    next: {
      id: 'opt_5d9d2292-c49c-45d6-83a9-f7a4056ed020',
      name: '播放有什么作用',
      fold: false,
      fromId: 'opt_c69a1bff-5dcc-4133-8b4d-f98c92b05244',
      fromSelectId: 'sel_6115ea1d-c86e-493a-8af0-60bc1aa83afa',
      nextRelations: [
        {
          id: 'sel_08fc3cbc-526b-46ad-9517-9baaa59474a1',
          name: '默认回答',
          fold: false,
          type: 'default',
          next: {
            jump: true,
            id: 'opt_c69a1bff-5dcc-4133-8b4d-f98c92b05244',
            flowId: '',
            jumpMode: 'node',
            retPosition: 'last',
            retSelection: 'defaultSelection',
          },
        },
      ],
    },
  }
  const QaNodeContent = {
    id: 'opt_5d9d2292-c49c-45d6-83a9-f7a4056ed020',
    name: '有什么作用',
    interfaceCode: '',
    kbId: '',
    sms: '',
    intelligenceMatch: 0,
    intention: '',
    imgUrl: '',
    tag: '作用',
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
            description:
              '水库面膜的精华液水源采用阿尔卑斯山冰川水，由于其高标准的矿物质，尤其是钙和硅，可以加强皮肤的屏障功能，为皮肤结构提供更好的保护，进而舒缓皮肤组织，恢复皮肤弹性，皮肤变得更加柔软。',
            type: 'text',
            content:
              '水库面膜的精华液水源采用阿尔卑斯山冰川水，由于其高标准的矿物质，尤其是钙和硅，可以加强皮肤的屏障功能，为皮肤结构提供更好的保护，进而舒缓皮肤组织，恢复皮肤弹性，皮肤变得更加柔软。',
          },
        ],
        srcProperties: [
          {
            description: '',
            type: 'custom',
            content: '',
          },
          {
            description:
              '水库面膜的精华液水源采用阿尔卑斯山冰川水，由于其高标准的矿物质，尤其是钙和硅，可以加强皮肤的屏障功能，为皮肤结构提供更好的保护，进而舒缓皮肤组织，恢复皮肤弹性，皮肤变得更加柔软。',
            type: 'text',
            content:
              '水库面膜的精华液水源采用阿尔卑斯山冰川水，由于其高标准的矿物质，尤其是钙和硅，可以加强皮肤的屏障功能，为皮肤结构提供更好的保护，进而舒缓皮肤组织，恢复皮肤弹性，皮肤变得更加柔软。',
          },
        ],
      },
    ],
    selections: [
      {
        id: 'sel_08fc3cbc-526b-46ad-9517-9baaa59474a1',
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
            name: 'text',
            type: 'text',
            value:
              '水库面膜的精华液水源采用阿尔卑斯山冰川水，由于其高标准的矿物质，尤其是钙和硅，可以加强皮肤的屏障功能，为皮肤结构提供更好的保护，进而舒缓皮肤组织，恢复皮肤弹性，皮肤变得更加柔软。',
            desc:
              '水库面膜的精华液水源采用阿尔卑斯山冰川水，由于其高标准的矿物质，尤其是钙和硅，可以加强皮肤的屏障功能，为皮肤结构提供更好的保护，进而舒缓皮肤组织，恢复皮肤弹性，皮肤变得更加柔软。',
          },
          {
            name: 'image',
            type: 'image',
            value: '/ss-img/89fb3259797a1906d1ee7365b81a95bf.png',
            desc: '有什么作用',
          },
          {
            name: 'longImage',
            type: 'longImage',
            value: '/ss-img/2156d1d1436ce99e217e9c1c61c61a81.png',
            desc: '有什么作用',
          },
          {
            name: 'audio',
            type: 'audio',
            value: '/vse/631684653845192704/631684684727853056/631684684727853056.wav',
            desc:
              '水库面膜的精华液水源采用阿尔卑斯山冰川水，由于其高标准的矿物质，尤其是钙和硅，可以加强皮肤的屏障功能，为皮肤结构提供更好的保护，进而舒缓皮肤组织，恢复皮肤弹性，皮肤变得更加柔软。',
          },
          {
            name: 'video',
            type: 'video',
            value: '/vse/common/631684653845192704.flv',
            desc: '韩束面膜回答客户1',
          },
          {
            name: 'action',
            type: 'action',
            value: null,
            desc: '动作',
          },
          {
            name: 'mouthShape',
            type: 'mouthShape',
            value: null,
            desc: '口型',
          },
          {
            name: 'eye',
            type: 'eye',
            value: null,
            desc: '眼睛',
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
    nodePayload: {
      sameScreenTag: '作用',
      sameScreenType: 'qa',
    },
    interrupt: null,
  }
  // 注意sel部分的id不可信，无关联，拼接数据需要重新赋值
  const QaSel = {
    id: 'sel_4217f4e0-9f88-4881-addd-c7254a05f2de',
    name: '我对这本书不感兴趣',
    type: 'rule',
    rule: '(不感兴趣)|(我对这本书不感兴趣)',
    count: null,
    tag: '兴趣',
    labels: [],
    ruleCheckFlag: null,
  }
  // 兜底和问答之间的默认节点
  const defaultNode = {
    id: 'sel_2d94f720-65c8-41c6-a620-8b07cc5869bf',
    name: '默认回答',
    fold: false,
    type: 'default',
    next: {
      jump: true,
      id: '',
      flowId: '',
      jumpMode: 'retMain',
      retPosition: 'last',
      retSelection: 'defaultSelection',
    },
  }
  // 注意sel部分的id不可信，无关联，拼接数据需要重新赋值
  const defSel = {
    id: 'sel_6d6ddc14-9633-4e60-893c-88badd385dba',
    name: '默认回答',
    type: 'default',
    rule: '',
    count: null,
    tag: null,
    labels: [],
    ruleCheckFlag: null,
  }
  // 兜底节点
  const bottom = {
    id: 'sel_eda2d8d9-3b96-4efa-824c-1dc466f5bc74',
    name: '兜底',
    fold: false,
    type: 'rule',
    next: {
      id: 'opt_0afdc31c-4717-44a0-a963-ceefb39d071e',
      name: '兜底',
      fold: false,
      fromId: 'opt_c69a1bff-5dcc-4133-8b4d-f98c92b05244',
      fromSelectId: 'sel_eda2d8d9-3b96-4efa-824c-1dc466f5bc74',
      nextRelations: [
        {
          id: 'sel_388ed377-0ffd-44da-857b-4b5f464f61e9',
          name: '默认回答',
          fold: false,
          type: 'default',
          next: {
            jump: true,
            id: 'opt_c69a1bff-5dcc-4133-8b4d-f98c92b05244',
            flowId: '',
            jumpMode: 'node',
            retPosition: null,
            retSelection: null,
          },
        },
      ],
    },
  }
  const bottonContent = {
    id: 'opt_0afdc31c-4717-44a0-a963-ceefb39d071e',
    name: '兜底',
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
            description: '',
            type: 'text',
            content: '',
          },
        ],
        srcProperties: [
          {
            description: '',
            type: 'text',
            content: '',
          },
        ],
      },
    ],
    selections: [
      {
        id: 'sel_388ed377-0ffd-44da-857b-4b5f464f61e9',
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
            value: '/vse/common/632869152410968064.flv',
            desc: '韩束背景视频',
          },
        ],
        extension: [],
      },
    ],
    nodePayload: {
      sameScreenBottom: 'bottom',
    },
    interrupt: null,
  }
  // 注意sel部分的id不可信，无关联，拼接数据需要重新赋值
  const bottonSel = {
    id: 'sel_dbfdf233-cec2-490f-830f-617b63b62f4d',
    name: '兜底',
    type: 'rule',
    rule: 'index_event_time:[1 TO 1000000000000000]&bot_last_input_length:[1 TO 10000]',
    count: null,
    tag: null,
    labels: [],
    ruleCheckFlag: 0,
  }
  const botMediaFragments = {
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
        type: 'text',
        content: '',
      },
    ],
    srcProperties: [
      {
        description: '',
        type: 'text',
        content: '',
      },
    ],
  }
  const botOperations = {
    internal: [
      {
        name: 'text',
        type: 'text',
        value: '',
        desc: '',
      },
      {
        name: 'image',
        type: 'image',
        value: '',
        desc: '',
      },
      {
        name: 'longImage',
        type: 'longImage',
        value: null,
        desc: null,
      },
      {
        name: 'audio',
        type: 'audio',
        value: null,
        desc: null,
      },
      {
        name: 'video',
        type: 'video',
        value: '',
        desc: '',
      },
    ],
    extension: [],
  }

  return {
    mainTree,
    mainNodeContent,
    QaNode,
    QaNodeContent,
    QaSel,
    defaultNode,
    defSel,
    bottom,
    bottonContent,
    bottonSel,
    botMediaFragments,
    botOperations,
  }
}
