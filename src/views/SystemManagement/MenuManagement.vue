<template>
  <div class="app-container">
    <el-row style="height:40px;line-height:40px;" type="flex">
			<el-col :span="10">
				<span>新增菜单：</span>
				<el-input v-model="menuName" style="width:70%"></el-input>
			</el-col>
      <el-col class="edit" :span="14">
        <el-button>查询</el-button>
        <el-button @click="addDialog">新增菜单</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-row style="height: calc(100% - 40px)">
      <el-card class="role-card">
        <el-table
          ref="multipleTable"
          :data="list"
          height="calc(100% - 5vh)"
          :header-cell-style="{ background: '#11ac9b !important', color: '#ffffff', }"
          :highlight-current-row="highlight"
          style="width: 100%"
          :row-style="rowStyle"
        >
          <el-table-column
            label="序号"
            align="center"
            type="index"
            :index="recordFormat"
            width="80px"
            min-width="80px"
          />
          <el-table-column
            v-for="item in tableHeader"
            :key="item.key"
            :label="item.label"
            show-overflow-tooltip
            align="center"
            :min-width="item.minWidth"
            :width="item.width"
          >
            <template v-slot="scope">
              <span v-if="item.key === 'operate'">
								<el-button type="text" @click="openShareDialog(scope.row)">
                <el-icon>
                  <Edit />
                </el-icon>
                <span>修改</span>
              </el-button>
              <el-button type="text">
                <el-icon>
                  <Tools />
                </el-icon>
                <span>删除</span>
              </el-button>
							</span>
              <span v-else>{{ scope.row[item.key] }}</span>
            </template>
          </el-table-column>
        </el-table>

        <!--分页查询-->
        <el-row style="width: 100%; display: flex; justify-content: flex-end;">
          <el-pagination
            :current-page="page"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="serviceTotal"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </el-row>
      </el-card>
    </el-row>

    <!--弹框部分-->
    <MenuDialog
      :title="dialogTitle"
      :dialog-status="dialogStatus"
      v-model:show="dialogAdd"
      :temp1="temp"
      source="task"
    />
  </div>
</template>
<script>
import { Edit, Tools } from '@element-plus/icons-vue'
import MenuDialog from "./component/menuDialog.vue";
export default {
  name: 'TaskDistribute',
  components: { MenuDialog, Edit, Tools },
  data() {
    return {
      menuName:'',
      serviceTotal: 0,
      page: 1,
      pageSize: 10,
      list: [
        { route: '002', name: '张三', sort: '1', create_ts: '2022-12-33' },
        { route: '002', name: '张三', sort: '1', create_ts: '2022-12-33' },
        { route: '002', name: '张三', sort: '1', create_ts: '2022-12-33' },
        { route: '002', name: '张三', sort: '1', create_ts: '2022-12-33' },
      ],
      tableHeader: [
        { label: '菜单名称', key: 'name' },
        { label: '菜单排序', key: 'sort' },
        { label: '菜单路径', key: 'route' },
        { label: '创建时间', key: 'creat_ts' },
        { label: '操作', key: 'operate' },
      ],
      multipleSelection: [],
      statusOptions: [],
      temp: {},
      highlight: true,
      dialogTitle: '', // 弹框标题
      dialogStatus: '',
      dialogAdd: false,
      height: document.documentElement.clientHeight
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    openShareDialog(val) {
			console.log(val, 'ssss');
			this.tableData = val
      this.dialogAdd = true
    },
    getList() {
      this.tableLoading = true
    },
    // 分页查询
    handleCurrentChange(val) {
			console.log(val);
      this.getList()
    },
    recordFormat(index) {
      const page = this.page;
      const pagesize = this.pageSize;
      return (page - 1) * pagesize + index + 1;
    },
    handleSizeChange(pageSize) {
      this.page = 1;
      this.pageSize = pageSize;
      this.requestData();
    },

    // 清空已选项数组，且置空所有选择
    resetSelect() {
      this.selectRows = []
      this.temp = {}
      this.$refs.multipleTable.clearSelection()
    },
    
    // 新增角色
    addDialog() {
      this.highlight = false
      this.temp = {}
      this.dialogTitle = '新增角色'
      this.dialogStatus = 'create'
      this.dialogAdd = true
      console.log(this.dialogAdd,);
    },

  }
}
</script>
<style lang="scss">
.role-card {
  width: 100%;
  .el-card__body {
    padding: 5px;
    height: 100%;
  }
}

.el-table .change-row {
  background: #e4f4f3 !important;
}

.el-table .change-row-2 {
  background: #f9fafa !important;
}
</style>
<style lang="scss" scoped>
.app-container {
  height: 100%;
}
.select {
  color: #909399;
  font: 12px;
  .select_label {
    display: inline-block;
    font-size: 14px;
    color: #666666;
    line-height: 24px;
    margin-right: 10px;
  }
  .select_box {
    .el-input--medium .el-input__inner {
      height: 24px;
      background: #ffffff;
      border: 2px solid #797f8d;
      border-radius: 15px;
    }
  }
}

</style>

