<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.system_name" :placeholder="$t('systeminfo.system_name')" style="width: 300px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.system_type" :placeholder="$t('systeminfo.system_type')" clearable style="width: 110px" class="filter-item">
        <el-option v-for="item in systemTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <el-select v-model="listQuery.ascription" :placeholder="$t('systeminfo.ascription')" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        {{ $t('systeminfo.search') }}
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        {{ $t('systeminfo.add') }}
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        {{ $t('systeminfo.export') }}
      </el-button>
      <!-- <el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">
        {{ $t('systeminfo.reviewer') }}
      </el-checkbox> -->
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column :label="$t('systeminfo.system_id')" prop="system_id" sortable="custom" align="center" width="120px" :class-name="getSortClass('system_id')">
        <template slot-scope="{row}">
          <span>{{ row.system_id }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('systeminfo.system_name')" width="280px" align="center">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.system_name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('systeminfo.system_abbr')" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.system_abbr }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('systeminfo.system_type')" width="130px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.system_type | typeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('systeminfo.ascription')" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.ascription | ascriptionFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('systeminfo.online_time')" width="130px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.online_time }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('systeminfo.url_address')" width="400px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.url_address }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('systeminfo.account')" class-name="status-col" width="300px">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.account }}
          </el-tag>
          <!-- </template>
      </el-table-column>
      <el-table-column :label="$t('systeminfo.admin_account')" width="180px" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.admin_account | statusFilter">
            {{ row.admin_account }}
          </el-tag>
        </template> -->
        </template></el-table-column>

      <el-table-column :label="$t('systeminfo.actions')" align="center" width="165" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            {{ $t('systeminfo.edit') }}
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
            {{ $t('systeminfo.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="120px" style="width: 500px; margin-left:50px;">
        <el-form-item :label="$t('systeminfo.system_id')" prop="system_id">
          <el-input v-model="temp.system_id" :disabled="dialogStatus==='update'" />
        </el-form-item>
        <el-form-item :label="$t('systeminfo.system_name')" prop="system_name">
          <el-input v-model="temp.system_name" />
        </el-form-item>
        <el-form-item :label="$t('systeminfo.system_abbr')" prop="system_abbr">
          <el-input v-model="temp.system_abbr" />
        </el-form-item>
        <el-form-item :label="$t('systeminfo.system_type')" prop="system_type">
          <el-select v-model="temp.system_type" class="filter-item" placeholder="Please select">
            <el-option v-for="item in systemTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('systeminfo.ascription')" prop="system_type">
          <el-select v-model="temp.ascription" class="filter-item" placeholder="Please select">
            <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('systeminfo.online_time')" prop="online_time">
          <el-date-picker v-model="temp.online_time" type="datetime" placeholder="Please pick a date" />
        </el-form-item>
        <el-form-item :label="$t('systeminfo.url_address')" prop="url_address">
          <el-input v-model="temp.url_address" />
        </el-form-item>
        <el-form-item :label="$t('systeminfo.account')" prop="account">
          <el-input v-model="temp.account" />
        </el-form-item>
        <el-form-item :label="$t('systeminfo.admin_address')" prop="admin_address">
          <el-input v-model="temp.admin_address" />
        </el-form-item>
        <el-form-item :label="$t('systeminfo.admin_account')" prop="admin_account">
          <el-input v-model="temp.admin_account" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, deleteArticle, createArticle, updateArticle } from '@/api/article'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

const calendarTypeOptions = [
  { key: '1', display_name: '锁丹' },
  { key: '2', display_name: '张广才' },
  { key: '3', display_name: '刘聿喆' },
  { key: '4', display_name: '樊晓畅' },
  { key: '5', display_name: '谢国正' },
  { key: '6', display_name: '陈致尧' }
]

const systemTypeOptions = [
  { key: '1', display_name: '大屏展示' },
  { key: '2', display_name: '管理应用' },
  { key: '3', display_name: '移动端' },
  { key: '4', display_name: '官网' },
  { key: '5', display_name: '其他' }
]
const systemTypeKeyValue = systemTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})
const ascriptionKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return systemTypeKeyValue[type]
    },
    ascriptionFilter(type) {
      return ascriptionKeyValue[type]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        system_name: undefined,
        system_abbr: undefined,
        system_type: undefined,
        sort: '-system_id'
      },
      calendarTypeOptions,
      systemTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: 'system_id' }, { label: 'ID Descending', key: '-system_id' }],
      showReviewer: false,
      temp: {
        system_name: undefined,
        system_abbr: undefined,
        system_type: undefined,
        timestamp: new Date()
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '添加'
      },
      rules: {
        system_id: [{ required: true, message: '系统编号必须输入', trigger: 'change' }],
        system_name: [{ required: true, message: '系统名称必须输入', trigger: 'change' }],
        system_type: [{ required: true, message: '系统类型必须选择', trigger: 'change' }],
        ascription: [{ required: true, message: '小微主必须选择', trigger: 'change' }],
        online_time: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'system_id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = 'system_id'
      } else {
        this.listQuery.sort = '-system_id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        system_name: undefined,
        system_abbr: undefined,
        system_type: undefined,
        timestamp: new Date()
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.author = 'admin'
          createArticle(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateArticle(tempData).then(() => {
            const index = this.list.findIndex(v => v.system_id === this.temp.system_id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row, index) {
      deleteArticle({ 'system_id': row.system_id }).then(() => {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
      })

      this.list.splice(index, 1)
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['系统编号', '系统名称', '系统简称', '系统分类', '小微主', '上线时间', '访问地址', '账号信息', '管理端地址', '管理端账号']
        const filterVal = ['system_id', 'system_name', 'system_abbr', 'system_type', 'ascription', 'online_time', 'url_address', 'account', 'admin_address', 'admin_account']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '系统信息一览'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>
