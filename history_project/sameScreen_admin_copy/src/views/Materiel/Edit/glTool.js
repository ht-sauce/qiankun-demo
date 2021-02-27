// 话术排序，对阵tab页下面的row的capabilityPatternDTOList数据
export const speechcraftsSort = list => {
  let nlist = []
  if (list && list.length > 1)
    nlist = list.sort((a, b) => {
      return a.materialType - b.materialType
    })
  else nlist = list
  return nlist
}
// 生成话术uuid
const SEL_PREFIX = 'sel_'
const OPT_PREFIX = 'opt_'

export function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
//是否是 sel_ 节点
export function isSelection(id) {
  return id && id.startsWith('sel_')
}
//是否是 opt_ 节点
export function isOperation(id) {
  return id && id.startsWith('opt_')
}

export function getOptUUID() {
  return OPT_PREFIX + uuid()
}

export function getSelUUID() {
  return SEL_PREFIX + uuid()
}
// 表单校验抽象
export function formCheck(refname, self) {
  return new Promise((resolve, reject) => {
    const vm = self.$refs['ruleForm']
    if (!vm) resolve()
    vm && vm.clearValidate()
    vm &&
      vm.validate(valid => {
        if (valid) resolve(true)
        else reject({ message: '有未填写项' })
      })
  })
}

// node节点转map结构
export function nodecToMap(node) {
  // 转map结构
  const newNode = new Map()
  node.forEach(item => {
    newNode.set(item.id, item)
  })
  return newNode
}

// 解析树菜单中存在的node节点并且返回
export function getAllNode(tree, allNodeMap) {
  const allNodes = [] // 所有node节点
  const recursion = (trees, allNode) => {
    const nextRelations = trees.nextRelations

    const node = allNodeMap.get(trees.id)
    node && allNodes.push(node)
    nextRelations &&
      nextRelations.forEach(item => {
        const nexts = item.next
        nexts && recursion(nexts, allNode)
      })
  }
  tree && recursion(tree, allNodeMap)

  /*console.log(allNodes)*/
  return allNodes
}

// 资源
function internalResources(internalMap, _videoEcho) {
  return {
    text: internalMap.get('text'),
    image: internalMap.get('image'),
    longImage: internalMap.get('longImage'),
    audio: internalMap.get('audio'),
    video: {
      ...internalMap.get('video'),
      _videoEcho, // 视频回显内容
    },
    eye: internalMap.get('eye'),
    mouthShape: internalMap.get('mouthShape'),
    action: internalMap.get('action'),
    bottom: internalMap.get('bottom'),
  }
}

// 获取单个nodeContent内需要的资源，尽可能的获取全
export function getNodeResources(node = {}) {
  const { id, name, mediaFragments, nodePayload, tag } = node
  const internal = mediaFragments[0].internal
  const internalMap = new Map()

  internal.forEach(item => {
    internalMap.set(item.name, item)
  })

  //console.log(nodePayload)
  // 视频回显地址
  const _videoEcho = nodePayload._videoEcho ? nodePayload._videoEcho : {}
  _videoEcho.url = internalMap.get('video')?.value
  // 为了兼容老数据，统一把老数据改为本地视频结构
  _videoEcho.radio = _videoEcho.radio ? _videoEcho.radio : 1

  let audioContent = null
  node?.operations[0].sayProperties.forEach(li => {
    if (li.type === 'text') audioContent = li.description
  })

  const Resources = {
    id: id,
    nodeName: name,
    tag,
    audioContent,
    ...internalResources(internalMap, _videoEcho),
  }

  return Resources
}
// 和getNodeResources类似，但是是获取多个媒体数据
export function getManyNodeResources(node = {}) {
  if (JSON.stringify(node) === '{}') return []
  const { mediaFragments, nodePayload, tag, operations } = node
  //console.log(nodePayload)

  const getInternalMap = internal => {
    const internalMap = new Map()
    for (let i = 0; i < internal.length; i++) {
      const li = internal[i]
      internalMap.set(li.name, li)
    }
    return internalMap
  }

  const Resources = [] // 资源数组

  for (let i = 0; i < mediaFragments.length; i++) {
    const li = mediaFragments[i]
    const internalMap = getInternalMap(li.internal)
    // 约定视频回显地址是当前的数组的顺序，所以等塞入话术市场的时候也要根据目前兜底for顺序的顺序插入回显数据
    const _videoEcho = nodePayload[i] ? nodePayload[i] : {}
    _videoEcho.url = internalMap.get('video')?.value
    // 为了兼容老数据，统一把老数据改为本地视频结构
    _videoEcho.radio = _videoEcho.radio ? _videoEcho.radio : 1
    let audioContent = null
    operations[i].sayProperties.forEach(li => {
      if (li.type === 'text') audioContent = li.description
    })

    const ResourcesLi = {
      tag: tag,
      audioContent,
      ...internalResources(internalMap, _videoEcho),
    }

    Resources.push(ResourcesLi)
  }

  return Resources
}

// 深拷贝
export function copy(data) {
  return JSON.parse(JSON.stringify(data))
}
