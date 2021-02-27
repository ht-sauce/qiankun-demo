import nodeTemplate from './nodeTemplate'
import { getOptUUID, getSelUUID, copy } from '../glTool'

// 分析话术树流程，拆分为业务所需节点
function analysisQaTree(tree) {
  if (!tree || JSON.stringify(tree) === '{}')
    return {
      MainTree: null,
      sections: [],
      defaultTree: null,
      bottomTree: null,
    }

  const list = tree.nextRelations || []
  // main节点得到
  tree.nextRelations = null
  const MainTree = tree
  const sections = [] // 拆分为和Qa问答有关的分类树
  let defaultTree = {} // 默认节点树
  let bottomTree = {} // 兜底节点树

  for (let i = 0; i < list.length; i++) {
    const li = list[i]
    if (li.type === 'default') defaultTree = li
    else {
      if (li.next.nextRelations[0].next.retPosition === 'last') sections.push(li)
      else bottomTree = li
    }
  }

  return {
    MainTree,
    sections,
    defaultTree,
    bottomTree,
  }
}
// 获取第一个nodecontent里面的结构数据
function getNSM(node) {
  if (!node)
    return {
      nodeSelectionsMap: new Map(),
      defSel: null,
      bottomSel: null,
    }
  const list = new Map()
  const maxI = node.selections.length - 1
  let defSel = null
  let bottomSel = null
  node.selections.forEach((item, index) => {
    if (item.type === 'default') defSel = item
    else if (index === maxI) bottomSel = item
    else list.set(item.id, item)
  })

  return {
    nodeSelectionsMap: list,
    defSel,
    bottomSel,
  }
}

// 话术生成
class BuildSpeechcraft {
  word = null // 初始话术数据
  mainData = null // Qa分类问答数据
  MainOptId = null // 主流程顶上的id
  bottom = null // 兜底数据
  constructor(
    mainData, // Qa分类问答数据
    bottom, // 兜底数据
    word, // 话术数据
  ) {
    this.word = word
    this.mainData = mainData
    this.bottom = bottom

    // 顶级唯一节点生成
    const { mTree, mainContent } = this.topOne()
    this.MainOptId = mTree.id
    // 默认回答
    const { defTree, defaultSel } = this.defaultQa()
    // 新兜底树数据
    const { botTree, botSel } = this.BottonTree()
    const BottonNode = this.BottonNode(botTree, bottom)
    // 主流程数据生成
    const { treeArr, nodeSelArr, nodeContentArr } = this.mainDataBuild()
    // 最后组合数据
    // - 树数据组合
    mTree.nextRelations = []
    mTree.nextRelations.push(...treeArr, defTree, botTree)
    const treeContent = mTree
    // -nodeContent组合
    const nodeContent = []
    mainContent.selections = [...nodeSelArr, defaultSel, botSel]
    nodeContent.push(mainContent, ...nodeContentArr, BottonNode)

    // console.log(treeContent, nodeContent)

    return {
      treeContent,
      nodeContent,
    }
  }
  // 对象是否为空，不为空则返回对象本身
  _isObjNull(obj) {
    return obj && JSON.stringify(obj) === '{}' ? null : obj
  }
  // 顶级唯一节点生成
  topOne() {
    let { MainTree, nodeContentMap } = this.word // 最顶上的树
    const { mainTree, mainNodeContent } = nodeTemplate()
    // 如果只有一个主节点则当做不存在
    if (MainTree && MainTree.name === '开场白') {
      MainTree = null
      nodeContentMap = new Map()
    }
    // 主流程顶上的树
    const mTree = this._isObjNull(MainTree) || mainTree
    const MainOptId = mTree.id
    const mainContent = nodeContentMap.get(mTree.id) || mainNodeContent
    mainContent.id = MainOptId

    return {
      mTree,
      mainContent,
    }
  }
  // 默认回答生成
  defaultQa() {
    const { defaultNode, defSel } = nodeTemplate()
    const { defaultTree } = this.word
    const wdefsel = this.word.defSel
    // 兜底和主流程之间的默认节点
    const defTree = this._isObjNull(defaultTree) || defaultNode
    const defaultSel = wdefsel || defSel
    defaultSel.id = defTree.id
    return {
      defTree,
      defaultSel,
    }
  }
  // 兜底树生成
  BottonTree() {
    const { bottom, bottonSel } = nodeTemplate()
    const { bottomTree, bottomSel } = this.word
    const botTree = bottomTree && JSON.stringify(bottomTree) !== '{}' ? bottomTree : bottom
    // sel部分节点
    const botSel = bottomSel && JSON.stringify(bottomSel) !== '{}' ? bottomSel : bottonSel
    botSel.id = botTree.id
    // 树节点
    botTree.next.fromId = this.MainOptId
    botTree.next.fromSelectId = botTree.id
    botTree.next.nextRelations.forEach(item => {
      if (item.type === 'default') {
        item.next.id = this.MainOptId
      }
    })

    return {
      botTree,
      botSel,
    }
  }
  // 兜底node节点生成
  BottonNode(tree = {}, botdata = []) {
    const { bottonContent, botMediaFragments, botOperations } = nodeTemplate()
    const { nodeContentMap, materialType } = this.word
    const bnode = nodeContentMap.get(tree.next.id) || bottonContent
    // 先保证各项id为正确
    bnode.id = tree.next.id
    let selid = null
    tree.next.nextRelations.forEach(item => {
      if (item.type === 'default') selid = item.id
    })
    bnode.selections.forEach(item => {
      if (item.type === 'default') item.id = selid
    })
    // 按选择数据顺序生成mediaFragments和operations
    // 注意兜底部分不存在数据换位功能，所以必定和话术市场的顺序一致
    // 如果做数据换位那么，就必须覆盖生成，因为无法得知话术市场的数据和目前这边的数据顺序是否一致，并且没有标志id
    const { mediaFragments, operations } = bnode

    // 根据现有的数据顺序去匹配替换数据
    botdata.forEach((item, index) => {
      // 先定义回显音视频数据
      bnode.nodePayload[index] = item.videoInfo
      // operations
      const ot = this._BottonNodeOperations(operations[index] || botOperations, item)
      // mediaFragments
      const mf = this._BottonNodeMediaFragments(mediaFragments[index] || botMediaFragments, item)

      mediaFragments[index] ? (mediaFragments[index] = mf) : mediaFragments.push(mf)
      operations[index] ? (operations[index] = ot) : operations.push(ot)
    })
    // 修改了内容赋值回去
    bnode.mediaFragments = mediaFragments
    bnode.operations = operations

    return bnode
  }
  _BottonNodeOperations(ot, item) {
    const { videoInfo } = item
    const { videInfo } = videoInfo
    const mfCon = {
      description: videInfo?.audioContent,
      type: 'text',
      content: videInfo?.audioContent,
    }
    ot.sayProperties.forEach((otli, index) => {
      if (otli.type === 'text') ot.sayProperties[index] = mfCon
    })
    ot.srcProperties.forEach((otli, index) => {
      if (otli.type === 'text') ot.srcProperties[index] = mfCon
    })
    return ot
  }
  _BottonNodeMediaFragments(mf, item) {
    const { materialType } = this.word

    const isVideo = materialType === 2 || materialType === 4
    const { image, name, videoInfo } = item
    const { videInfo } = videoInfo
    // console.log(videoInfo)

    let _mtext = [false, -1]
    let _image = [false, -1]
    let _longImage = [false, -1]
    let _audio = [false, -1]
    let _video = [false, -1]
    // 循环
    const internal = mf.internal
    for (let i = 0; i < internal.length; i++) {
      const mfitem = internal[i]
      if (mfitem.type === 'text') _mtext = [true, i]
      if (mfitem.type === 'image') _image = [true, i]
      if (mfitem.type === 'longImage') _longImage = [true, i]
      if (mfitem.type === 'audio') _audio = [true, i]
      if (mfitem.type === 'video') _video = [true, i]
    }

    const modityT = (typeName, type = [], conObj = {}) => {
      const obj = {
        name: typeName,
        type: typeName,
        ...conObj,
      }
      if (type[0]) internal[type[1]] = obj
      else internal.push(obj)
    }
    // 充分考虑数组对应内容存在与否
    modityT('text', _mtext, {
      value: name,
      desc: name,
    })
    modityT('image', _image, {
      value: image,
      desc: image,
    })
    modityT('longImage', _longImage, {
      value: image,
      desc: image,
    })
    !isVideo &&
      modityT('audio', _audio, {
        value: videInfo?.audioUrl,
        desc: videInfo?.name,
      })
    isVideo &&
      modityT('video', _video, {
        value: videoInfo.url,
        desc: videInfo?.name,
      })
    return mf
  }
  // 主流程数据部分
  mainDataBuild() {
    const list = this._getMainList()
    const { sections, nodeSelectionsMap, nodeContentMap } = this.word
    const sectionsTreeMap = new Map()
    sections.forEach(li => {
      sectionsTreeMap.set(li.next.id, li)
    })

    const { QaNode, QaNodeContent, QaSel } = nodeTemplate()

    const treeArr = []
    const nodeSelArr = []
    const nodeContentArr = []
    list.forEach(li => {
      const optid = li.id
      const tree = copy(sectionsTreeMap.get(optid) || QaNode) // 树数据
      const nodeSel = copy(nodeSelectionsMap.get(tree.id) || QaSel) // 第一个节点里面的sel部分数据
      const nodeContent = copy(nodeContentMap.get(optid) || QaNodeContent) // nodeContent部分
      this._regularId(tree, nodeSel, nodeContent) // 整理id
      this._mainDataReplace(li, tree, nodeSel, nodeContent) // 数据修改
      // 数据存入
      treeArr.push(tree)
      nodeSelArr.push(nodeSel)
      nodeContentArr.push(nodeContent)
    })

    return {
      treeArr,
      nodeSelArr,
      nodeContentArr,
    }
  }
  // 树数据转list
  _getMainList() {
    const mainData = this.mainData
    const list = []
    mainData.forEach(li => {
      li.children.forEach(it => {
        list.push(it)
      })
    })
    return list
  }
  // 规整id，主流程部分全量生成
  _regularId(tree, nodeSel, nodeContent) {
    // 先规整id
    const optOne = getOptUUID()
    const selOne = getSelUUID()
    const selTwo = getSelUUID()
    // 树数据
    tree.id = selOne
    tree.next.id = optOne
    tree.next.fromId = this.MainOptId
    tree.next.fromSelectId = selOne
    tree.next.nextRelations.forEach(li => {
      if (li.type === 'default') {
        li.id = selTwo
        li.next.id = this.MainOptId
      }
    })
    // sel部分数据
    nodeSel.id = selOne
    // nodecontent部分
    nodeContent.id = optOne
    nodeContent.selections.forEach(li => {
      if (li.type === 'default') li.id = selTwo
    })
  }
  // 数据修改
  _mainDataReplace(data, tree, nodeSel, nodeContent) {
    const { label, image, tag, rules, videoInfo, isVisual } = data
    const { videInfo } = videoInfo
    const { audioUrl, audioContent } = videInfo || {}
    // 树数据
    tree.name = label
    tree.next.name = '播放' + label
    // 首页节点下面的sel部分
    nodeSel.name = label
    nodeSel.tag = tag
    nodeSel.rule = `(${rules})|(${label})`
    // nodecontent节点内容
    nodeContent.name = label
    nodeContent.tag = label
    nodeContent.nodePayload.sameScreenTag = tag
    nodeContent.nodePayload._videoEcho = videoInfo
    nodeContent.nodePayload.isVisual = isVisual
    // nodecontent内部媒体内容
    nodeContent.operations[0].sayProperties.forEach(li => {
      if (li.type === 'type') {
        li.description = audioContent
        li.content = audioContent
      }
    })
    nodeContent.operations[0].srcProperties.forEach(li => {
      if (li.type === 'type') {
        li.description = audioContent
        li.content = audioContent
      }
    })
    nodeContent.mediaFragments[0].internal = this._mediaFragmentsReplace({
      mf: nodeContent.mediaFragments[0].internal,
      name: audioContent,
      nameDesc: audioContent,
      audioContent,
      image,
      imageName: label,
      audioUrl,
      videoInfo,
      videInfo,
    })
  }
  // 媒体数据替换
  _mediaFragmentsReplace({
    mf = [],
    name = null,
    nameDesc = null,
    image = null,
    imageName = null,
    longImage = null,
    longImageName = null,
    videoInfo = {},
    videInfo = {},
  } = {}) {
    const { materialType } = this.word
    const isVideo = materialType === 2 || materialType === 4
    // 媒体部分
    //const mf = con.mediaFragments[0].internal || []
    let _text = [false, -1]
    let _image = [false, -1]
    let _longImage = [false, -1]
    let _audio = [false, -1]
    let _video = [false, -1]
    let action = [false, -1]
    let mouthShape = [false, -1]
    let bottom = [false, -1]
    let eye = [false, -1]
    for (let i = 0; i < mf.length; i++) {
      const mfitem = mf[i]
      switch (mfitem.type) {
        case 'eye': {
          eye = [true, i]
          break
        }
        case 'bottom': {
          bottom = [true, i]
          break
        }
        case 'mouthShape': {
          mouthShape = [true, i]
          break
        }
        case 'action': {
          action = [true, i]
          break
        }
        case 'text': {
          _text = [true, i]
          break
        }
        case 'image': {
          _image = [true, i]
          break
        }
        case 'longImage': {
          _longImage = [true, i]
          break
        }
        case 'audio': {
          _audio = [true, i]
          break
        }
        case 'video': {
          _video = [true, i]
          break
        }
      }
    }

    const modityT = (typeName, type = [], conObj = {}) => {
      const obj = {
        name: typeName,
        type: typeName,
        ...conObj,
      }
      if (type[0]) mf[type[1]] = obj
      else mf.push(obj)
    }
    // 充分考虑数组对应内容存在与否

    modityT('eye', eye, {
      value: null,
      desc: null,
    })

    modityT('bottom', bottom, {
      value: null,
      desc: null,
    })

    modityT('mouthShape', mouthShape, {
      value: null,
      desc: null,
    })

    modityT('action', action, {
      value: null,
      desc: null,
    })

    modityT('text', _text, {
      value: name,
      desc: nameDesc,
    })
    modityT('image', _image, {
      value: image,
      desc: imageName,
    })
    modityT('longImage', _longImage, {
      value: longImage,
      desc: longImageName,
    })
    modityT('audio', _audio, {
      value: videInfo?.audioUrl,
      desc: videInfo?.audioContent,
    })

    isVideo &&
      modityT('video', _video, {
        value: videoInfo?.url,
        desc: videInfo?.name,
      })

    return mf
  }
}
// 分组列表保存数据生成
function groupData(groupData = [], materialId) {
  if (!groupData) return []
  if (groupData.length === 1 && groupData[0].label === '未分类') return []

  groupData.splice(groupData.length - 1, 1) // 未分类不参与分组数据生成
  const list = []
  groupData.forEach(li => {
    const qalist = []
    li.children.forEach(item => {
      const { label, tag, isVisual } = item
      qalist.push({ qaDesc: label, tag, isVisual })
    })

    const { id, groupName } = li
    const tem = {
      groupId: id,
      groupName,
      materialId,
      questionDTOList: qalist,
    }
    list.push(tem)
  })
  let noNull = true // 检测是否全部都是空分类
  list.forEach(li => {
    if (li.questionDTOList.length > 0) noNull = false
  })

  return noNull ? [] : list
}

export { analysisQaTree, getNSM, BuildSpeechcraft, groupData }
