<template>
  <div style="height: 100%;">
    <el-row style="height: calc(37%);">
      <el-card class="box-card">
        <el-row type="flex" class="barRow">
          <el-col :span="12" class="barCol">
            <div class="barContent">
              <span>子应用统计</span>
              <div class="barDiv">
                <PieChart :chart-data="seriesData" chartName="PieChart"></PieChart>
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
                <DownloadChart :chart-data="appStatistic" chartName="DownloadChart"></DownloadChart>
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
      regionPieData: {
        seriesData: {
          // {
          //   type: 'max',
          //   data: [
          //     [1663171200000, 123],
          //     [1663171260000, 55],
          //     [1663171320000, 23],
          //     [1663171380000, 123],
          //     [1663171440000, 132],
          //   ]
          // },
          // {
          //   type: '已用容量',
          //   data: [
          //     [1663171200000, 22],
          //     [1663171260000, 53],
          //     [1663171320000, 43],
          //     [1663171380000, 123],
          //     [1663171440000, 45],
          //   ]
          // },
          // {
          //   type: '可用容量',
          //   data: [
          //     [1663171200000, 100],
          //     [1663171260000, 35],
          //     [1663171320000, 93],
          //     [1663171380000, 25],
          //     [1663171440000, 75],
          //   ]
          // },
					// {
          //   type: '已映射LUN容量',
          //   data: [
          //     [1663171200000, 122],
          //     [1663171260000, 43],
          //     [1663171320000, 93],
          //     [1663171380000, 103],
          //     [1663171440000, 205],
          //   ]
          // },
					// {
          //   type: '未映射LUN容量',
          //   data: [
          //     [1663171200000, 22],
          //     [1663171260000, 43],
          //     [1663171320000, 93],
          //     [1663171380000, 103],
          //     [1663171440000, 185],
          //   ]
          // },
					// {
          //   type: 'Thin LUN总容量',
          //   data: [
          //     [1663171200000, 100],
          //     [1663171260000, 150],
          //     [1663171320000, 200],
          //     [1663171380000, 103],
          //     [1663171440000, 185],
          //   ]
          // },
          max: [
            [1663171200000, 123],
            [1663171260000, 55],
            [1663171320000, 23],
            [1663171380000, 123],
            [1663171440000, 132],
          ],
          average: [
            [1663171200000, 22],
            [1663171260000, 53],
            [1663171320000, 43],
            [1663171380000, 123],
            [1663171440000, 45],
          ],
          quantile: [
            [1663171200000, 22],
            [1663171260000, 43],
            [1663171320000, 93],
            [1663171380000, 103],
            [1663171440000, 185],
          ]
        },
        title: '子应用转发请求统计'
      },
      seriesData: [
        { value: 1, name: '省公司' },
        { value: 2, name: '市公司' },
        { value: 3, name: '工区' },
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
        { label: '应用ID', key: 'createId' },
        { label: '应用状态', key: 'appCheckStatus' },
        { label: '应用地址', key: 'applicationDownloadAddress' },
        { label: '应用负责人', key: 'contactPerson' },
        { label: '联系方式', key: 'contactPersonTel' },
      ],
    }
  },
  created() {
    this.getData()
		this.getStatisticAnalysis()
  },
  methods: {
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
        console.log(res, 'res');
				this.tableList = res.data.rows
				this.total = res.data.total
      })
    },
		getStatisticAnalysis() {
			api.getStatisticAnalysis().then(res => {
				this.seriesData = res.data.appConnectUserCount
				this.appRequestCount = res.data.appRequestCount
				this.appVisitCount = res.data.appVisitCount
				res.data.appStatistic.forEach((ele) => {
					for( let key in ele) {
						this.appStatistic.push({name: key, value: ele[key]})
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