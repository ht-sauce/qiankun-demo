import {
  getNodeById,
  treeToList,
  getConnList
} from "@/utils/tree.js"

/*
 * 话术流程相关
 */
const state = {
  tree: null,
  treeList: [], //tree.json转换成数组
  connList: [],
  isEdit: false //是否发生改变
}

// getters
const getters = {}

// actions
const actions = {
  setEdit({
    commit
  }, isEdit) {
    commit("SET_EDIT", isEdit);
  },
  setNodeFold({
    commit,
    rootState
  }, {
    node,
    fold
  }) {
    commit("SET_NODE_FOLD", {
      node,
      fold
    });
    commit("RSET_TREE_LIST",rootState.setting.subList);
    commit("RSET_CONN_LIST");
  },
  setTree({
    commit
  }, treeData) {
    commit("SET_TREE", treeData);
  },
  setTreeList({
    commit
  }, treeList) {
    commit("SET_TREE_LIST", treeList);
  },
  setConnList({
    commit
  }, connList) {
    commit("SET_CONN_LIST", connList);
  },
  removeNode({
    commit,
    rootState
  }, node) { //删除当前节点及相应的子节点
    commit("REMOVE_NODE", node);
    commit("RSET_TREE_LIST",rootState.setting.subList);
    commit("RSET_CONN_LIST")
  },
  insertNode({
    commit,
    rootState
  }, {
    node,
    newNode
  }) {
    commit("INSERT_NODE", {
      node,
      newNode
    });
    commit("RSET_TREE_LIST",rootState.setting.subList);
    commit("RSET_CONN_LIST");
  },
  insertBefore({
    commit,
    rootState
  }, {
    node,
    newNode
  }) {
    commit("INSERT_BEFORE", {
      node,
      newNode
    });
    commit("RSET_TREE_LIST",rootState.setting.subList);
    commit("RSET_CONN_LIST");
  },
  insertAfter({
    commit,
    rootState
  }, {
    node,
    newNode
  }) {
    commit("INSERT_AFTER", {
      node,
      newNode
    });
    commit("RSET_TREE_LIST",rootState.setting.subList);
    commit("RSET_CONN_LIST");
  },
  modifyNodeName({
    commit
  }, {
    id,
    name
  }) {
    commit("MODIFY_TREE_NAME", {
      id,
      name
    })
    commit("MODIFY_LIST_NAME", {
      id,
      name
    })
  }
}
// mutations
const mutations = {
  SET_NODE_FOLD(state, {
    node,
    fold
  }) {
    let n = getNodeById(state.tree, node.id);
    if (n) {
      n.fold = fold;
    }
  },
  MODIFY_TREE_NAME(state, {
    id,
    name
  }) {
    let n = getNodeById(state.tree, id);
    n && (n.name = name);
  },
  MODIFY_LIST_NAME(state, {
    id,
    name
  }) {
    let node = state.treeList.find(n => n.id == id);
    node && (node.name = name);
  },
  SET_NODES(state, nodes) {
    state.nodes = nodes;
  },
  SET_EDIT(state, isEdit) {
    state.isEdit = isEdit;
  },
  SET_TREE(state, treeData) {
    state.tree = treeData;
  },
  RSET_TREE_LIST(state,list) {
    state.treeList = treeToList(state.tree,list);
  },
  RSET_CONN_LIST(state) {
    state.connList = getConnList(state.treeList);
  },
  SET_TREE_LIST(state, treeList) {
    state.treeList = treeList;
  },
  SET_CONN_LIST(state, connList) {
    state.connList = connList;
  },
  INSERT_NODE(state, {
    node,
    newNode
  }) {
    let n = getNodeById(state.tree, node.id);
    if (n) {
      n.jump = false;
      if(n.data){
        n.data.refNodeId && (n.data.refNodeId = "");
        n.data.flowId && (n.data.flowId = "");
        n.data.jumpMode && (n.data.jumpMode = "");
        n.data.retPosition && (n.data.retPosition = "");
        n.data.retSelection && (n.data.retSelection = "");
      }
      newNode.parent = n;
      n.children.push(newNode);
    }
  },
  INSERT_BEFORE(state, {
    node,
    newNode
  }) {
    let n = getNodeById(state.tree, node.id);
    if (!n || !n.parent) {
      return;
    }
    let index = n.parent.children.findIndex(item => item.id == n.id);
    newNode.parent = n.parent;
    n.parent.children.splice(index, 0, newNode);
  },
  INSERT_AFTER(state, {
    node,
    newNode
  }) {
    let n = getNodeById(state.tree, node.id);
    if (!n || !n.parent) {
      return;
    }
    let index = n.parent.children.findIndex(item => item.id == n.id);
    newNode.parent = n.parent;
    n.parent.children.splice(index + 1, 0, newNode);
  },
  REMOVE_NODE(state, node) {
    let n = getNodeById(state.tree, node.id);
    if (!n) {
      return;
    }
    n.children = []; //删除子节点
    let index = n.parent.children.findIndex(item => item.id == n.id);
    index > -1 && n.parent.children.splice(index, 1); //删除自身
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}