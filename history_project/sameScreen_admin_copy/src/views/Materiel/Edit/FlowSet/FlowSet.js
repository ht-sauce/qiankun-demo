import { nodeType, routineNode, StandbyNode, StandbyNodeTree } from './nodeTemplate'
import { getAllNode, getOptUUID, getSelUUID } from '../glTool'

// 生成待机节点nodeContent，主要是替换节点内存在的url地址
function GenerateStandbyNode({ url, name, oldNode, materialType } = {}) {
  const node = oldNode.length > 1 ? oldNode : StandbyNode
  // mediaFragments会存在多个数组值，无法区分只考虑第一项
  const internal = node[0].mediaFragments[0]?.internal || []
  // 复杂化考虑，考虑数组长短问题
  let video = [false, -1]
  let standbyVideo = [false, -1]
  let audio = [false, -1]
  internal.forEach((item, index) => {
    if (item.name === 'video') video = [true, index]
    if (item.name === 'standbyVideo') standbyVideo = [true, index]
    if (item.name === 'audio') audio = [true, index]
  })
  // 修改或增加内容
  const modity = (typeName, type = []) => {
    const obj = {
      name: typeName,
      type: typeName,
      value: url,
      desc: name,
    }
    if (type[0]) internal[type[1]] = obj
    else internal.push(obj)
  }
  // 充分考虑数组对应内容存在与否
  if (materialType === 2 || materialType === 4) modity('video', video) // 基础班和图文版没有视频设置，可以不添加类型控制
  modity('standbyVideo', standbyVideo)
  modity('audio', audio)

  node[0].mediaFragments[0].internal = internal
  //console.log(node)
  return node
}
// 组合待机节点, 得到待机初步模板
export function makeStandbyNode({ buttonset, globalword, materialType, word }) {
  const { ChildId } = word
  const da = buttonset.formData.endVideoConfig.echo
  const bgObj = globalword.BackgroundVideoSetEcho

  let videoInfo = {
    audioUrl: da?.videInfo?.audioUrl,
  }

  if (materialType === 2 || materialType === 4)
    videoInfo = {
      url: da?.url,
      name: da?.videInfo?.name,
    }
  else {
    videoInfo = {
      url: bgObj?.url,
      name: bgObj?.videoInfo?.name ? bgObj?.videoInfo?.name : bgObj?.url,
    }
  }
  let node = null
  let nodeTree = word.StandbyNode || {}
  const nodeContentMap = word.nodeContentMap

  // 替换nodeContent里面的地址信息
  node = GenerateStandbyNode({
    url: materialType === 3 || materialType === 1 ? videoInfo.audioUrl : videoInfo.url,
    name: videoInfo.name,
    materialType,
    oldNode: getAllNode(nodeTree, nodeContentMap),
  })

  if (!nodeTree.fromId) nodeTree = StandbyNodeTree

  nodeTree = _StandbyNodeTree(nodeTree, ChildId)

  return { node, nodeTree }
}
// 待机节点树处理
function _StandbyNodeTree(tree, flowid) {
  tree = JSON.parse(JSON.stringify(tree))
  for (let i = 0; i < tree.nextRelations.length; i++) {
    const item = tree.nextRelations[i]
    if (item.type === 'default') item.next.flowId = flowid
    if (item.type === 'flow') item.next.flowId = flowid
  }
  return tree
}
// 组合常规节点
export class MakeRoutineNode {
  constructor({ word, realTimeNode = [], StandbyNode }) {
    this.word = word
    this.realTimeNode = realTimeNode
    this.StandbyNode = StandbyNode

    const sectionsMap = new Map()
    word.sections.forEach(item => {
      sectionsMap.set(item.id, item)
    })
    this.sectionsMap = sectionsMap

    this._DifferenceCompletion()
    // 排序
    this.word.sections = this._sort()

    const { newTree, newNode } = this._ProcessGeneration()
    return { newTree, newNode }
  }
  // 第一步找出新增的节点，对话术流程和节点补全
  // 生成主要是以模板的方式生成节点
  _DifferenceCompletion() {
    const {
      id, // 话术id
      sections, // 主流程拆分
      nodeContentMap,
    } = this.word
    const realTimeNode = this.realTimeNode
    const sectionsMap = this.sectionsMap

    const noList = [] // 不在sections里面节点
    // 找到不在流程里面的节点
    for (let i = 0; i < realTimeNode.length; i++) {
      if (!sectionsMap.get(realTimeNode[i].id)) noList.push(realTimeNode[i])
    }

    noList.forEach(item => {
      const { name, productImg, videoInfo } = item

      const { node, nodeTree } = routineNode(
        item.id, // 第一个流程节点id，这个id必定和页面上的列表id一致
        id,
        name,
        productImg,
        { url: videoInfo.url, desc: videoInfo.videInfo.name },
        { url: videoInfo.videInfo.url, desc: videoInfo.videInfo.audioContent },
        '',
        2, // 1 开始节点，2中间节点，3最后一个节点
      )

      sections.push(nodeTree)
      sectionsMap.set(nodeTree.id, nodeTree)
      nodeContentMap.set(node[0].id, node[0])
      nodeContentMap.set(node[1].id, node[1])
    })
  }
  // 主流程需要换位需求情况下，在节点补全之后，对话术根据左侧列表重新排序
  _sort() {
    const leftlist = this.realTimeNode
    const sectionsMap = this.sectionsMap
    //const
    const newTree = []
    leftlist.forEach(item => {
      newTree.push(sectionsMap.get(item.id))
    })
    return newTree
  }
  /* 主流程生成
  以树节点（sections）为核心进行遍历，注意树节点顺序是绝对需要保证正确，流程拼接生成以此为依据
  1、递归数据节点数组
  2、递归的同时，对数节点内的所有的内容进行替换修改
  3、同时重新生成新的nodeContent数组，和拼接完成之后的主流程节点
   */
  _ProcessGeneration() {
    const { sections } = this.word
    const leftListMap = new Map()
    this.realTimeNode.forEach(item => {
      leftListMap.set(item.id, item)
    })
    // 递归数组树节点
    const newTree = this._handlerTree(0, leftListMap, sections.length - 1, '', '')
    //console.log('新的树结构', JSON.stringify(newTree))
    //console.log('新的nodeContent', JSON.stringify(this._newNodeContent))
    return {
      newTree,
      newNode: this._newNodeContent,
    }
  }
  _newNodeContent = [] // 新的nodeContent
  // 处理节点树
  _handlerTree(index, leftListMap, max, fromId, fromSelectId) {
    if (index > max) {
      this._newNodeContent.push(...this.StandbyNode.node)
      return this.StandbyNode.nodeTree
    }
    // 全量重新生成id，除待机节点（待机节点为复用模板）
    const optId = getOptUUID()
    const optIdTwo = getOptUUID()
    const selId = getSelUUID()
    const selTwo = getSelUUID()
    const selThree = getSelUUID()

    const { ChildId, sections, nodeContentMap } = this.word
    const node = JSON.parse(JSON.stringify(sections[index]))
    // 节点数据替换为新的值
    const leftitem = leftListMap.get(node.id)
    const { name } = leftitem
    const con = nodeContentMap.get(node.id)
    const conOneNew = this._handOptNode(con, leftitem, index, max, optId, selId) // 处理nodeContent节点
    this._newNodeContent.push(conOneNew)
    // 修改id等关键信息往后处理
    node.name = name
    node.id = optId
    node.fromId = fromId
    node.fromSelectId = fromSelectId
    // 一层子节点
    for (let ni = 0; ni < node.nextRelations.length; ni++) {
      const nr = node.nextRelations[ni]
      if (nr.type === 'default') {
        nr.id = selId
        nr.name = `进入${name}判断`
        const nnr = nr.next
        // 第二个opt内容
        const conTwo = nodeContentMap.get(nnr.id)
        const conTwoNew = this._handOptNodeTwo(conTwo, leftitem, optIdTwo, selTwo, selThree) // 处理nodeContent节点
        this._newNodeContent.push(conTwoNew)
        // 修改id等关键信息往后处理
        nnr.name = `${name}判断`
        nnr.id = optIdTwo
        nnr.fromId = optId
        nnr.fromSelectId = selId
        // 二层子节点
        for (let nnri = 0; nnri < nnr.nextRelations.length; nnri++) {
          const two = nnr.nextRelations[nnri]
          // 转话术组
          if (two.type === 'flow') {
            two.id = selTwo
            two.next.flowId = ChildId // 子话术id
          }
          // 子节点内容
          if (two.type === 'default') {
            two.id = selThree
            // 递归得到下一个节点内容
            const nextNode = this._handlerTree(index + 1, leftListMap, max, optIdTwo, selThree)
            two.name = '进入' + nextNode?.name

            // 第二个节点的name部分需要后处理下
            conTwoNew.selections.forEach(item => {
              if (item.type === 'default') {
                item.id = selThree
                item.name = two.name
              }
            })
            two.next = nextNode
          }
        }
      }
    }
    return node
  }
  _handOptNode(con, leftitem, index, max, optId, selId) {
    const { materialType } = this.word
    const isVideo = materialType === 2 || materialType === 4
    con = JSON.parse(JSON.stringify(con))
    let type = 0
    if (index === 0) type = 1
    if (index > 0 && index < max) type = 2
    if (index === max) type = 3
    //console.log(leftitem)
    const { name, videoInfo, productImg, longImage } = leftitem
    const { videInfo } = videoInfo
    const { audioContent, audioUrl } = videInfo || {}
    con.id = optId
    con.name = name
    con.imgUrl = productImg

    const cos = con.operations[0].sayProperties
    const cosrc = con.operations[0].srcProperties
    let _custom = [false, -1]
    let _text = [false, -1]
    for (let i = 0; i < cos.length; i++) {
      if (cos[i].type === 'custom') _custom = [true, i]
      if (cos[i].type === 'text') _text = [true, i]
    }
    // 修改或增加内容
    const modity = (typeName, type = [], content, list) => {
      const obj = {
        description: content,
        type: typeName,
        content: content,
      }
      if (type[0]) list[type[1]] = obj
      else list.push(obj)
    }
    // 充分考虑数组对应内容存在与否
    modity('custom', _custom, '', cos)
    modity('text', _text, audioContent, cos)
    modity('custom', _custom, '', cosrc)
    modity('text', _text, audioContent, cosrc)

    con.selections.forEach(item => {
      if (item.type === 'default') {
        item.id = selId
        item.name = `进入${name}判断`
      }
    })
    // 媒体部分
    const mf = con.mediaFragments[0].internal || []
    let _mtext = [false, -1]
    let _image = [false, -1]
    let _longImage = [false, -1]
    let _audio = [false, -1]
    let _video = [false, -1]
    for (let i = 0; i < mf.length; i++) {
      const mfitem = mf[i]
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
      if (type[0]) mf[type[1]] = obj
      else mf.push(obj)
    }
    // 充分考虑数组对应内容存在与否
    modityT('text', _mtext, {
      value: audioContent,
      desc: audioContent,
    })
    modityT('image', _image, {
      value: productImg,
      desc: name,
    })
    modityT('longImage', _longImage, {
      value: longImage,
      desc: name,
    })
    !isVideo &&
      modityT('audio', _audio, {
        value: audioUrl,
        desc: videInfo?.name,
      })

    isVideo &&
      modityT('video', _video, {
        value: videoInfo.url,
        desc: videInfo?.name,
      })

    con.nodePayload = nodeType[type] || {}
    con.nodePayload._videoEcho = videoInfo

    return con
  }
  // 内容节点转话术组处理
  _handOptNodeTwo(con, leftitem, optIdTwo, selTwo, selThree) {
    con = JSON.parse(JSON.stringify(con))
    const { name } = leftitem
    con.id = optIdTwo
    con.name = name + '判断'
    con.selections.forEach(item => {
      if (item.type === 'flow') {
        item.id = selTwo
      }
      if (item.type === 'default') {
        item.id = selThree
        item.name = ''
      }
    })

    return con
  }
}
// 主流程递归遍历，把树结构转化为左侧节点列表,和待机节点分离
export function analysisToNode(tree) {
  const sections = [] // 分割节点数组
  let StandbyNode = null // 待机节点
  let ischange = false // 是否在话术市场被改动
  // 递归遍历
  const recursion = trees => {
    // json遍历
    const arr = trees.nextRelations

    // 是否存在待机节点，通过多轮交互节点判断是否为待机节点
    let countNode = null // 多轮交互
    let defNode = null // 默认节点

    for (let i = 0; i < arr.length; i++) {
      if (arr[i].type === 'count') countNode = true
      if (arr[i].type === 'default') defNode = arr[i].next.nextRelations
    }
    // 最终节点判断
    const finaly = next => {
      let isFlow = false
      let isDef = false
      let nextTree = null
      // 找到有转话术组和默认节点的内容部分
      for (let j = 0; j < next.length; j++) {
        if (next[j].type === 'flow') isFlow = true
        if (next[j].type === 'default') {
          isDef = true
          nextTree = JSON.parse(JSON.stringify(next[j].next))
          next[j].next = null // 简化结构，避免观察混乱
        }
      }
      if (isFlow && isDef) {
        // 数组分割
        const newTree = JSON.parse(JSON.stringify(trees))
        sections.push(newTree)
        // 进入下一次递归
        recursion(nextTree)
      } else {
        ischange = tree
      }
    }

    // 最后判断存在多轮交互则直接得出待机节点
    if (countNode) StandbyNode = trees
    else if (defNode) finaly(defNode)

    return ischange
  }
  // 开始递归
  tree.id && recursion(tree)

  // console.log('常规节点', sections)
  // console.log('待机节点', StandbyNode)
  return {
    ischange,
    sections,
    StandbyNode,
  }
}
