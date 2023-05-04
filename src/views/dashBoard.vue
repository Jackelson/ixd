<template>
  <div style="height: 100%;">
    <el-row style="height: calc(37%);">
      <el-card class="box-card">
        <el-row type="flex" class="barRow">
          <el-col :span="12" class="barCol">
            <div class="barContent">
              <span>子应用统计</span>
              <div class="barDiv">
                <PieChart :chart-data="appStatistic" chartName="PieChart"></PieChart>
              </div>
            </div>
          </el-col>
          <el-col :span="12" class="barCol">
            <div class="barContent">
              <span>子应用转发请求统计</span>
              <div class="barDiv">
                <LineChart :chart-data="appRequestCount" chartName="LineChart"></LineChart>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-card>
    </el-row>
    <el-row style="height: calc(37%); margin: 1vh 0;">
      <el-card class="box-card">
        <el-row type="flex" class="barRow">
          <el-col :span="12" class="barCol">
            <div class="barContent">
              <span>子应用访问量统计</span>
              <div class="barDiv">
                <VisitsChart :chart-data="appVisitCount" chartName="VisitsChart"></VisitsChart>
              </div>
            </div>
          </el-col>
          <el-col :span="12" class="barCol">
            <div class="barContent">
              <span>子应用用户数</span>
              <div class="barDiv">
                <DownloadChart :chart-data="seriesData" chartName="DownloadChart"></DownloadChart>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-card>
    </el-row>
    <el-row style="width: 100%; height: calc(26% - 2vh)">
      <el-table
        :data="tableList"
        height="calc(100% - 0vh)"
        :header-cell-style="{ background: '#11ac9b !important', color: '#ffffff', }"
        :cell-style="{ padding: 5 + 'px' }"
        :row-class-name="tableRowClassName"
        style="width: 100%"
        size="mini"
        ref="table"
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
          :prop="item.key"
          :label="item.label"
          show-overflow-tooltip
          align="center"
          :min-width="item.minWidth"
          :width="item.width"
        >
          <template v-slot="scope">
            <span>{{ scope.row[item.key] }}</span>
          </template>
        </el-table-column>
      </el-table>
      <!-- <el-pagination
          :current-page="page"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
      />-->
    </el-row>
  </div>
</template>

<script>
import * as api from "@/api/dashBoard"
import PieChart from "./components/pieChart.vue";
import LineChart from "./components/lineChart.vue";
import VisitsChart from "./components/visitsChart.vue";
import DownloadChart from "./components/downloadChart.vue";

export default {
  name: 'DashBoard',
  components: {
    PieChart,
    LineChart,
    VisitsChart,
    DownloadChart
  },
  data() {
    return {
      seriesData: [
        // { value: 1, name: '省公司' },
        // { value: 2, name: '市公司' },
        // { value: 3, name: '工区' },
      ],
      appRequestCount: [],
      appVisitCount: [],
      appStatistic: [],
      tableList: [
        // { appId: '11', status: '已上架', address: '无', leader: 'user4', phone: '' },
        // { appId: '11', status: '已上架', address: '无', leader: 'user4', phone: '' },
        // { appId: '11', status: '已上架', address: '无', leader: 'user4', phone: '' },
      ],
      page: 1,
      pageSize: 10,
      total: 0,
      tableHeader: [
        { label: '应用ID', key: 'id' },
        { label: '名称', key: 'appName' },
        { label: '描述', key: 'appDescribe' },
        { label: '应用状态', key: 'state' },
        { label: '首页地址', key: 'appIndexUrl' },
        { label: '业务域', key: 'businessName' },
        { label: '所属部门', key: 'department' },
        { label: '应用检测状态', key: 'appCheckStatus' },
        { label: '是否离线', key: 'offLineApp' },
        { label: '应用管理员', key: 'contactPerson' },
        { label: '所属公司', key: 'businessName' },
        { label: '负责人姓名', key: 'contactPerson' },
        { label: '联系方式', key: 'contactPersonTel' },
        { label: '电子邮箱', key: 'contactEmail' },
      ],
    }
  },
  created() {
    this.getStatisticAnalysis()
    this.getData()
  },
  methods: {
	// (-1删除，0 未提交，1 提交审批，2.上架状态(也就是审批通过)，3审批驳回 4 流程删除 5下架状态 6 已撤销 7 申请下架状态 8 申请上架状态
		getState(val) {
			if(val === '-1') return val = '删除'
			if(val === '0') return val = '未提交'
			if(val === '1') return val = '提交审批'
			if(val === '2') return val = '上架'
			if(val === '3') return val = '审批驳回'
			if(val === '4') return val = '流程删除'
			if(val === '5') return val = '下架'
			if(val === '6') return val = '已撤销'
			if(val === '7') return val = '申请下架'
			if(val === '8') return val = '申请上架'
		},
		getoffLineApp(val) {
			if(val === 0) return val = '离线应用'
			if(val === 1) return val = '在线应用'
		},
		getappCheckStatus(val) {
			if(val === 0) return val = '未检测'
			if(val === 1) return val = '已检测'
		},
    filtData(val) {
      if (val === 'offshellCount') {
        return val = '已下架'
      } else if (val === 'registerCount') {
        return val = '已注册'

      } else if (val === 'groundingCount') {
        return val = '已上架'

      } else {
        return val
      }
    },
    getData() {
      let params = {
        // "appName": "测试11",
        // "appDescribe": "1111",
        // "appSecretKey": "123123",
        // "appAffiliatedCompany": "1231231",
        // "contactPerson": "123123",
        // "contactPersonTel": "13951631328",
        // "contactEmail": "123@qq.com",
        // "dateStart": "2023-02-16 02:17:44",
        // "dateEnd": "2023-02-16 02:17:44"
      }
      api.getAppInfo(params).then(res => {
        this.tableList = Object.assign([], res.data.rows)
				this.tableList.forEach(ele => {
					ele.state = this.getState(ele.state)
					ele.offLineApp = this.getoffLineApp(ele.offLineApp)
					ele.appCheckStatus = this.getappCheckStatus(ele.appCheckStatus)
				})
        this.total = res.data.total
      })
    },
    getStatisticAnalysis() {
      api.getStatisticAnalysis().then(res => {
        this.seriesData = res.data.appConnectUserCount
        this.appRequestCount = res.data.appRequestCount
        this.appVisitCount = res.data.appVisitCount
        res.data.appStatistic.forEach((ele) => {
          for (let key in ele) {
            this.appStatistic.push({ name: this.filtData(key), value: ele[key] })
          }
        })
        console.log(this.appStatistic, 'ressss');
      })
    }
  }
}
</script>

<style lang="scss">
.box-card {
  .el-card__body {
    padding: 0;
    height: 100%;
  }
}
</style>le
<style lang="scss" scoped>
// 柱状图部分
.box-card {
  height: 100%;
  width: 100%;

  .barRow {
    height: 100%;
  }

  .barCol {
    padding: 7px 7px 0 7px;
  }

  .barContent {
    height: 100%;
  }

  span {
    // color: #fff;
    font-size: 1rem;
    line-height: 3.1vh;
    // margin-left: 4vh;
  }

  .barDiv {
    height: calc(100% - 4.5vh);
  }
}
.title {
  height: 3vh;
  padding: 0 1vh;
}
.chartDiv {
  height: calc(100% - 3vh);
}
</style>