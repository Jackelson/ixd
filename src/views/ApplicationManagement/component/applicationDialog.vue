<template>
  <div>
    <el-form class="aboutForm">
      <el-form-item v-for="(item, index) in formLabel" :key="index" :label="item.label">
        <el-select
          v-if="item.key === 'menu'"
          v-model="mineStatus"
          placeholder="请选择"
          multiple
          collapse-tags
          @change="selectChange"
        >
          <el-option :value="mineStatusValue" style="height: auto">
            <el-tree
              :data="data"
              show-checkbox
              node-key="id"
              ref="tree"
              highlight-current
              :props="defaultProps"
              @check-change="handleCheckChange"
            ></el-tree>
          </el-option>
        </el-select>

        <el-input v-else v-model="formList[item.key]"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formLabel: [
        { label: '应用ID', key: 'appId' },
        { label: '应用状态', key: 'status' },
        { label: '应用负责人', key: 'leader' },
        { label: '菜单权限', key: 'menu' },
      ],
      formList: {
        appId: 2222,
        status: '已上架',
        leader: '张三',
        menu: 'ddd'
      },
      mineStatus: [],
      mineStatusValue: [],
      data: [
        {
          id: 1,
          label: "一级 1",
          children: [
            {
              id: 4,
              label: "二级 1-1"
            }
          ]
        },
        {
          id: 2,
          label: "一级 2",
          children: [
            {
              id: 5,
              label: "二级 2-1"
            },
            {
              id: 6,
              label: "二级 2-2"
            }
          ]
        },
        {
          id: 3,
          label: "一级 3",
          children: [
            {
              id: 7,
              label: "二级 3-1"
            },
            {
              id: 8,
              label: "二级 3-2"
            }
          ]
        }
      ],
      defaultProps: {
        children: "children",
        label: "label"
      }
    }
  },
  setup() {

  },
  props: {
    tableData: {
      type: Object,
      required: true
    }
  },
  watch: {
    tableData: {
      handler(newValue) {
        this.formList = newValue
        console.log(newValue, 'sdfsdddddd');
        // 注意：在嵌套的变更中，
        // 只要没有替换对象本身，
        // 那么这里的 `newValue` 和 `oldValue` 相同
      },
      deep: true
    }
  },

  created() {
    this.formList = this.tableData
    console.log(this.tableData, 'sssssssssdddd');
  },
  methods: {
    selectChange(e) {
      let arrNew = [];
      let dataLength = this.mineStatusValue.length;
      let eleng = e.length;
      for (let i = 0; i < dataLength; i++) {
        for (let j = 0; j < eleng; j++) {
          if (e[j] === this.mineStatusValue[i].label) {
            arrNew.push(this.mineStatusValue[i])
          }
        }
      }
      this.$refs.tree.setCheckedNodes(arrNew);//设置勾选的值
    },
    handleCheckChange(val) {
			console.log(val, 'sssssssssss');
      // let res = this.$refs.tree.getCheckedNodes(true, true); //这里两个true，1. 是否只是叶子节点 2. 是否包含半选节点（就是使得选择的时候不包含父节点）
			let res = [val]
      let arrLabel = [];
      let arr = [];
      res.forEach(item => {
        arrLabel.push(item.label);
        arr.push(item);
      });
      this.mineStatusValue = arr;
      this.mineStatus = arrLabel;
      console.log('arr:' + JSON.stringify(arr))
      console.log('arrLabel:' + arrLabel)
			// console.log(this.$refs.tree.getCheckedNodes(), 'sssssss')
    }
  }
}
</script>
<style lang="scss">
.el-tree__empty-text {
	position: inherit !important;
}
</style>