<template>
  <div>
    <el-upload
      list-type="picture-card"
      :limit="1"
      :on-preview="preview"
      :on-remove="removeFile"
      :on-change="changeFile"
      :http-request="upload"
      action="#"
      :file-list="fileList"
      :before-upload="beforeUpload"
      :class="{ disabled: fileComputed }"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-progress
      v-if="progressShow"
      :percentage="percent"
      style="width: 170px"
    ></el-progress>
    <el-dialog :visible.sync="dialogVisible" title="图片预览">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import COS from 'cos-js-sdk-v5'
var cos = new COS({
  SecretId: 'AKIDYyBBdtvkMlxvfKvKXaT9csvkMlwtdAlD', // 身份识别 ID
  SecretKey: 'RedOvFKBoDOL4ZqukMjrnV3NTLyNXS9c' // 身份密钥
})
export default {
  name: 'ImageUpload',
  filters: {},
  components: {},
  data () {
    return {
      fileList: [],
      percent: 0,
      dialogImageUrl: '',
      dialogVisible: false,
      currentUid: null,
      progressShow: false
    }
  },
  computed: {
    fileComputed () {
      return this.fileList.length === 1
    }
  },
  watch: {},
  created () { },
  methods: {
    preview (file) {
      // console.log(file)
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    removeFile (file) {
      // 把原来的文件删除之后，本地的数据过滤掉被删除的数据，剩下的就是新数据了
      this.fileList = this.fileList.filter(item => item.uid !== file.uid)
      // this.fileList = fileList
    },
    changeFile (file, fileList) {
      // console.log(file)
      // console.log(fileList)
      // console.log(fileList.length)
      this.fileList = fileList.map(item => item)
    },
    // 上传图片时先进行校验的函数
    beforeUpload (file) {
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (!types.some(item => item === file.type)) {
        this.$message.error('上传图片只能是 JPG、GIF、BMP、PNG 格式!')
        return false
      }
      const maxSize = 5242880
      if (maxSize < file.size) {
        this.$message.error('上传的图片大小不能超过5M')
        return false
      }
      // console.log('file', file)
      // 在这里把当前文件的UID记下来
      this.currentUid = file.uid
      return true
    },
    upload (params) {
      cos.putObject({
        Bucket: 'lebronisme-1313062331', /* 填入您自己的存储桶，必须字段 */
        Region: 'ap-nanjing', /* 存储桶所在地域，例如ap-beijing，必须字段 */
        Key: params.file.name, /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */
        StorageClass: 'STANDARD',
        Body: params.file, // 上传文件对象
        onProgress: (params) => {
          this.progressShow = true
          this.percent = params.percent * 100
          console.log(params)
          // console.log(JSON.stringify(progressData))
        }
      }, (err, data) => {
        // console.log(err || data)
        // 进入这里，才说明文件上传成功
        if (!err && data.statusCode === 200) {
          this.fileList = this.fileList.map(item => {
            // 如果上传成功，判断当前图片是不是在filelist中，并显示出来
            if (item.uid === this.currentUid) {
              // 设置一个定时器，让进度条不那么快的消失
              setTimeout(() => {
                this.progressShow = false
                this.percent = 0
              }, 1000)
              // 将成功的地址返回给本地filelist
              return { url: 'http://' + data.Location, upload: true }
            }
            return item
          })
        }
      })
    }
  }
}
</script>

<style scoped lang='scss'>
::v-deep .disabled .el-upload--picture-card {
  display: none;
}
</style>
